package com.smartparkinglot.backend.controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.CustomerListParams;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController //REST returns a ResponseBody object that contains data in a format such as JSON or XML
public class StripeAPIController {
    @Value("${stripe.apiKey}")
    String stripeKey;

    private static int calculateOrderAmount(String id) {
        //se calculeaza suma totala de plata gen pretul locului de parcare(dupa id) x nr de ore
        return 1050; //10,50 lei
    }

    static class PaymentDetails {
        @JsonProperty("itemID")
        private String itemID;
        public String getItemID() {
            return itemID;
        }
        @JsonProperty("userID")
        private String userID;
        public String getUserID() {
            return userID;
        }
        public void setUserID(String id) {
            this.userID = id;
        }
    }

    static class CreatePaymentResponse {
        private String clientSecret;
        public CreatePaymentResponse(String clientSecret) {
            this.clientSecret = clientSecret;
        }
        public String getClientSecret() {
            return clientSecret;
        }
    }

    //se cauta in lista de customeri din stripe dupa nume
    public Customer retrieveByExternalId(String externalId) throws StripeException {
        CustomerListParams params = CustomerListParams.builder().build();
        List<Customer> customers = Customer.list(params).getData();

        for (Customer customer : customers) {
            String customerId = customer.getName(); // Folosește getDescription() în loc de getName()

            if (customerId != null && customerId.equals(externalId)) {
                return customer; // Returnează clientul găsit în Stripe
            }
        }

        return null;
    }


    @PostMapping("/create-payment-intent")
    public CreatePaymentResponse createPaymentIntent(@RequestBody PaymentDetails paymentRequest) throws StripeException {
        Stripe.apiKey = stripeKey;

        paymentRequest.setUserID("122");
        String customerId = paymentRequest.getUserID(); // ID-ul clientului din aplicatie
        int orderAmount = calculateOrderAmount(paymentRequest.getItemID());

        Customer customer;

        try {
            if (customerId != null) {
                customer = retrieveByExternalId(customerId);
                if (customer == null) {
                    // Dacă nu există (e la prima plată), se creează unul nou pentru a putea crea PaymentIntent
                    CustomerCreateParams params = CustomerCreateParams.builder()
                            .setName(customerId)
                            .build();
                    customer = Customer.create(params);
                }
            } else {
                throw new IllegalArgumentException("customerId is null");
            }
        } catch (StripeException e) {
            throw e;
        }

        //payment intent ne returneaza ClientSecret - un id secret care ofera informatii despre plata
        PaymentIntentCreateParams paymentParams = PaymentIntentCreateParams.builder()
                .setAmount((long)orderAmount)
                .setCustomer(customer.getId())
                .setCurrency("ron")
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods
                                .builder()
                                .setEnabled(true)
                                .build()
                )
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(paymentParams);
        System.out.println("Payment intent id: " + paymentIntent.getId());
        return new CreatePaymentResponse(paymentIntent.getClientSecret());
    }

    @GetMapping("/payment-complete")
    public String handlePaymentResult(@RequestParam("payment_intent") String paymentIntentId) {
        // 1. Extract the payment_intent ID
        System.out.println("Received Payment Intent ID: " + paymentIntentId);

        // 2. Retrieve PaymentIntent
        Stripe.apiKey = stripeKey;

        try {
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            String paymentStatus = paymentIntent.getStatus();
            System.out.println("Payment intent id: " + paymentIntent.getId());

            // Get user id(the id of the user whose balance will be increased in the database
            Customer customer = Customer.retrieve(paymentIntent.getCustomer());
            String customerName = customer.getName(); // Access the name here
            System.out.println("Customer id: " + customerName);

            // Handle Success, failures, etc. based on paymentStatus
            if (paymentStatus.equals("succeeded")) {
                // Payment successful - Update user balance, send confirmations, etc.
                System.out.println("Payment successful");
                return "payment-success";
            } else {
                // Payment failed or other status - Handle accordingly
            }
        } catch (StripeException e) {
            // Handle errors from Stripe API
            System.out.println("Error retrieving PaymentIntent: " + e.getMessage());
        }
        return "payment-result";
    }
}