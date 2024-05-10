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
            Customer customer = getOrCreateCustomer(paymentDetailsDTO.getUserMail());
            PaymentIntent paymentIntent = createStripePaymentIntent(customer, paymentDetailsDTO.getAmount());

            log.info("Payment intent created: {}", paymentIntent.getId());
            return new PaymentResponseDTO(paymentIntent.getClientSecret());
        } catch (StripeException e) {
            log.error("Error creating payment intent: {}", e.getMessage());
            throw new PaymentException("Error processing payment.");
        }
    }

    private void validatePaymentDetails(PaymentDetailsDTO paymentDetailsDTO) {
        if (paymentDetailsDTO.getUserMail() == null || paymentDetailsDTO.getUserMail().isEmpty()) {
            throw new PaymentException("User email is required.");
        }
        if (paymentDetailsDTO.getAmount() <= 0) {
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

    private PaymentIntent createStripePaymentIntent(Customer customer, long amount) throws StripeException {
        PaymentIntentCreateParams paymentParams = PaymentIntentCreateParams.builder()
                .setAmount(amount)
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
        //doar afiseaza statusul platii
        Stripe.apiKey = stripeConfig.getApiKey();

        try {
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            String paymentStatus = paymentIntent.getStatus();
            Customer customer = Customer.retrieve(paymentIntent.getCustomer());
            long amount = paymentIntent.getAmount();
            logPaymentResult(paymentIntentId, paymentStatus, customer.getEmail(), amount);

            return switch (paymentStatus) {
                case "succeeded" -> {
                    log.info("Payment successful");
                    yield "payment-success";
                }
                case "requires_action" -> {
                    log.info("Payment requires action");
                    yield "payment-requires-action";
                }
                case "failed" -> {
                    log.info("Payment failed");
                    yield "payment-failed";
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

    public String getErrorMessage(String paymentIntentId) {
        try {
            Stripe.apiKey = stripeConfig.getApiKey();
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            //Assuming 'last_payment_error' contains the error message you want to retrieve
            if (paymentIntent.getLastPaymentError() != null) {
                return paymentIntent.getLastPaymentError().getMessage();
            }
            return null;
        } catch (StripeException e) {
            log.error("Error retrieving payment intent error message: {}", e.getMessage());
            throw new PaymentException("Error retrieving payment error message.");
        }
    }

    private void logPaymentResult(String paymentIntentId, String paymentStatus, String customerEmail, long amount) {
        log.info("Received Payment Intent ID: {}", paymentIntentId);
        log.info("Payment intent status: {}", paymentStatus);
        log.info("Customer email: {}", customerEmail);
        log.info("Payment Amount: {}", amount);
    }

}