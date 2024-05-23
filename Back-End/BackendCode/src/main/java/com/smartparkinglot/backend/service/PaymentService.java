package com.smartparkinglot.backend.service;

import com.smartparkinglot.backend.DTO.PaymentDetailsDTO;
import com.smartparkinglot.backend.DTO.PaymentIntentDTO;
import com.smartparkinglot.backend.DTO.PaymentResponseDTO;
import com.smartparkinglot.backend.configuration.StripeConfig;
import com.smartparkinglot.backend.customexceptions.PaymentException;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.CustomerBalanceTransaction;
import com.stripe.model.CustomerBalanceTransactionCollection;
import com.stripe.model.PaymentIntent;
import com.stripe.param.*;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentService {

    private final StripeConfig stripeConfig;
    private final Logger log = LoggerFactory.getLogger(PaymentService.class);

    @Autowired
    private EmailService emailService;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeConfig.getApiKey();
    }

    public PaymentService(StripeConfig stripeConfig) {
        this.stripeConfig = stripeConfig;
    }

    public PaymentResponseDTO createPaymentIntent(PaymentDetailsDTO paymentDetailsDTO) {
        try {
            Stripe.apiKey = stripeConfig.getApiKey();

            validatePaymentDetails(paymentDetailsDTO);
            Customer customer = getOrCreateCustomer(paymentDetailsDTO.getUserEmail());
            PaymentIntent paymentIntent = createStripePaymentIntent(customer, paymentDetailsDTO.getAmount());

            log.info("Payment intent created: {}", paymentIntent.getId());
            return new PaymentResponseDTO(paymentIntent.getClientSecret(), paymentIntent.getId());
        } catch (StripeException e) {
            log.error("Error creating payment intent: {}", e.getMessage());
            throw new PaymentException("Error processing payment.");
        }
    }

    private void validatePaymentDetails(PaymentDetailsDTO paymentDetailsDTO) {
        if (paymentDetailsDTO.getUserEmail() == null || paymentDetailsDTO.getUserEmail().isEmpty()) {
            throw new PaymentException("User email is required.");
        }
        if (paymentDetailsDTO.getAmount() < 2) {
            throw new PaymentException("Amount must be greater than 2.");
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

    private PaymentIntent createStripePaymentIntent(Customer customer, Double amount) throws StripeException {
        PaymentIntentCreateParams paymentParams = PaymentIntentCreateParams.builder()
                .setAmount((long)(amount*100))
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

            String customerEmail = getCustomerEmail(paymentIntentId);
            Long amount = paymentIntent.getAmount();
            Double amountToAdd = amount / 100.0;
            logPaymentResult(paymentIntentId, paymentStatus, customerEmail, amountToAdd);

            return switch (paymentStatus) {
                case "succeeded" -> {
                    log.info("Payment successful");
                    emailService.sendConfirmationEmail(customerEmail);
                    createCustomerBalanceTransaction(customerEmail,amountToAdd);
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
                    log.info("Payment canceled");
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

    public void logPaymentResult(String paymentIntentId, String paymentStatus, String customerEmail, Double amount) {
        log.info("Received Payment Intent ID: {}", paymentIntentId);
        log.info("Payment intent status: {}", paymentStatus);
        log.info("Customer email: {}", customerEmail);
        log.info("Payment Amount: {}", amount);
    }



    public Double retrieveCustomerBalance(String customerEmail) {
        Stripe.apiKey = stripeConfig.getApiKey();
        try {
            CustomerListParams params = CustomerListParams.builder()
                    .setEmail(customerEmail)
                    .build();

            List<Customer> customers = Customer.list(params).getData();
            if (customers.isEmpty()) {
                throw new RuntimeException("No customer found with email: " + customerEmail);
            } else {
                Customer customer = customers.get(0);
                return customer.getBalance() / 100.0;
            }
        } catch (StripeException e) {
            throw new RuntimeException("Error retrieving customer balance from Stripe", e);
        }
    }

    public List<PaymentIntentDTO> getTransactionsHistory(String customerEmail) {
        Stripe.apiKey = stripeConfig.getApiKey();

        try {
            CustomerListParams customerListParams = CustomerListParams.builder()
                    .setEmail(customerEmail)
                    .build();

            List<Customer> customers = Customer.list(customerListParams).getData();
            if (customers.isEmpty()) {
                throw new RuntimeException("No customer found with email: " + customerEmail);
            } else {
                Customer customer = customers.get(0);
                CustomerBalanceTransactionsParams params =
                        CustomerBalanceTransactionsParams.builder().build();

                CustomerBalanceTransactionCollection transactionCollection = customer.balanceTransactions(params);
                List<CustomerBalanceTransaction> transactions = transactionCollection.getData();

                List<PaymentIntentDTO> paymentIntents = new ArrayList<>();
                for (CustomerBalanceTransaction transaction : transactions) {
                    PaymentIntentDTO paymentIntentDTO = new PaymentIntentDTO();
                    paymentIntentDTO.setId(transaction.getId());
                    paymentIntentDTO.setAmount(transaction.getAmount()/100.0);
                    paymentIntentDTO.setCurrency(transaction.getCurrency());
                    paymentIntentDTO.setDescription(transaction.getDescription());
                    paymentIntentDTO.setCreatedFromTimestamp(transaction.getCreated());
                    paymentIntents.add(paymentIntentDTO);
                }

                return paymentIntents;
            }
        } catch (StripeException e) {
            throw new RuntimeException("Error retrieving customer transactions from Stripe", e);
        }
    }

    public String createCustomerBalanceTransaction(String customerEmail, Double amount) {
        Stripe.apiKey = stripeConfig.getApiKey();

        try {
            CustomerListParams customerListParams = CustomerListParams.builder()
                    .setEmail(customerEmail)
                    .build();

            List<Customer> customers = Customer.list(customerListParams).getData();
            if (customers.isEmpty()) {
                throw new RuntimeException("No customer found with email: " + customerEmail);
            } else {
                Customer customer = customers.get(0);
                Double currentBalance = customer.getBalance()/100.0;

                if((currentBalance + amount) < 0)
                    return "insufficient-balance";
                else {
                    CustomerBalanceTransactionCollectionCreateParams params =
                            CustomerBalanceTransactionCollectionCreateParams.builder()
                                    .setAmount((long)(amount*100)) // Positive to increase, negative to decrease
                                    .setCurrency("ron")
                                    .build();

                    CustomerBalanceTransaction customerBalanceTransaction =
                            customer.balanceTransactions().create(params);
                    return "success";
                }
            }
        } catch (StripeException e) {
            throw new RuntimeException("Error creating customer balance transaction", e);
        }
    }
}