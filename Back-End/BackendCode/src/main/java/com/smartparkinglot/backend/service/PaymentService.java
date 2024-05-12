package com.smartparkinglot.backend.service;

import com.smartparkinglot.backend.DTO.PaymentDetailsDTO;
import com.smartparkinglot.backend.DTO.PaymentResponseDTO;
import com.smartparkinglot.backend.configuration.StripeConfig;
import com.smartparkinglot.backend.customexceptions.PaymentException;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.CustomerListParams;
import com.stripe.param.PaymentIntentCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    private final StripeConfig stripeConfig;
    private final Logger log = LoggerFactory.getLogger(PaymentService.class);

    public PaymentService(StripeConfig stripeConfig) {
        this.stripeConfig = stripeConfig;
    }

    public PaymentResponseDTO createPaymentIntent(PaymentDetailsDTO paymentDetailsDTO) {
        try {
            Stripe.apiKey = stripeConfig.getApiKey();

            validatePaymentDetails(paymentDetailsDTO);
            Customer customer = getOrCreateCustomer(paymentDetailsDTO.getUserEmail());
            PaymentIntent paymentIntent = createStripePaymentIntent(customer, paymentDetailsDTO.getPrice());

            log.info("Payment intent created: {}", paymentIntent.getId());
            return new PaymentResponseDTO(paymentIntent.getClientSecret(), paymentIntent.getId());
        } catch (StripeException e) {
            log.error("Error creating payment intent: {}", e.getMessage());
            throw new PaymentException("Error processing payment.");
        }
    }

    public PaymentDetailsDTO getPaymentDetails(String paymentIntentId) {
        try {
            Stripe.apiKey = stripeConfig.getApiKey();
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            Long longPrice = paymentIntent.getAmount();
            double doublePrice = longPrice / 100.0;
            String customerEmail = getCustomerEmail(paymentIntentId);

            return new PaymentDetailsDTO(customerEmail, doublePrice);
        } catch (StripeException e) {
            log.error("Error retrieving payment details: {}", e.getMessage());
            throw new PaymentException("Error retrieving payment details.");
        }
    }

    private void validatePaymentDetails(PaymentDetailsDTO paymentDetailsDTO) {
        if (paymentDetailsDTO.getUserEmail() == null || paymentDetailsDTO.getUserEmail().isEmpty()) {
            throw new PaymentException("User email is required.");
        }
        if (paymentDetailsDTO.getPrice() <= 0) {
            throw new PaymentException("Amount must be greater than zero.");
        }
        // Add more validation as needed
    }

    private Customer getOrCreateCustomer(String email) throws StripeException {
        CustomerListParams params = CustomerListParams.builder()
                .setEmail(email)
                .build();
        List<Customer> customers = Customer.list(params).getData();
        if (customers.isEmpty()) {
            CustomerCreateParams createParams = CustomerCreateParams.builder()
                    .setEmail(email)
                    .build();
            return Customer.create(createParams);
        }
        return customers.get(0);
    }

    private PaymentIntent createStripePaymentIntent(Customer customer, double amount) throws StripeException {
        PaymentIntentCreateParams paymentParams = PaymentIntentCreateParams.builder()
                .setAmount((long)amount)
                .setCustomer(customer.getId())
                .setCurrency("ron")
                .setReceiptEmail(customer.getEmail())
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods
                                .builder()
                                .setEnabled(true)
                                .build()
                )
                .build();

        return PaymentIntent.create(paymentParams);
    }

    public String handlePaymentResult(String paymentIntentId) {

        try {
            Stripe.apiKey = stripeConfig.getApiKey();
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            String paymentStatus = paymentIntent.getStatus();

            return switch (paymentStatus) {
                case "succeeded" -> {
                    log.info("Payment successful");
                    yield "payment-success";
                }
                case "incomplete" -> {
                    log.info("Payment requires action");
                    yield "payment-incomplete";
                }
                case "failed" -> {
                    log.info("Payment failed");
                    yield "payment-failed";
                }
                case "canceled" -> {
                    log.info("Paymenth canceled");
                    yield "payment-canceled";
                }
                case "uncaptured" -> {
                    log.info("Payment uncaptured");
                    yield "payment-uncaptured";
                }
                default -> {
                    log.info("Payment status unknown: {}", paymentStatus);
                    yield "payment-unknown";
                }
            };
        } catch (StripeException e) {
            log.error("Error retrieving PaymentIntent: {}", e.getMessage());
            return "payment-error";
        }
    }

    public String getCustomerEmail(String paymentIntentId) {
        try {
            Stripe.apiKey = stripeConfig.getApiKey();
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            Customer customer = Customer.retrieve(paymentIntent.getCustomer());
            return customer.getEmail();
        } catch (StripeException e) {
            log.error("Error retrieving customer email: {}", e.getMessage());
            throw new PaymentException("Error retrieving customer email.");
        }
    }

    public void logPaymentResult(String paymentIntentId, String paymentStatus, String customerEmail, double amount) {
        log.info("Received Payment Intent ID: {}", paymentIntentId);
        log.info("Payment intent status: {}", paymentStatus);
        log.info("Customer email: {}", customerEmail);
        log.info("Payment Amount: {}", amount);
    }

}