package com.smartparkinglot.backend.controller;

import com.smartparkinglot.backend.DTO.PaymentDetailsDTO;
import com.smartparkinglot.backend.DTO.PaymentResponseDTO;
import com.smartparkinglot.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;


@RestController
public class StripeAPIController {
    private final PaymentService paymentService;

    @Autowired
    public StripeAPIController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }


    @PostMapping("/") //given the userMail and price as JSON, returns clientSecret and paymentIntentID as a JSON
    public ResponseEntity<PaymentResponseDTO> createPaymentIntent(@RequestBody PaymentDetailsDTO paymentRequest) {
        PaymentResponseDTO response = paymentService.createPaymentIntent(paymentRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/after-payment-processing")
    public ResponseEntity<?> handlePaymentStatus(@RequestParam("payment_intent") String paymentIntentId) {
        String result = paymentService.handlePaymentResult(paymentIntentId);

        switch (result) {
            case "payment-success":
                //Update the user's balance in the database using the email
                return ResponseEntity.ok("Payment succeeded!");
            case "payment-incomplete":
                //
                return ResponseEntity.ok("Your payment is incomplete.");
            case "payment-failed":
                //
                return ResponseEntity.ok("Your payment was not successful, please try again.");
            case "payment-canceled":
                //
                return ResponseEntity.ok("Your payment was canceled.");
            case "payment-uncaptured":
                //
                return ResponseEntity.ok("Your payment is uncaptured.");
            default:
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unknown error occurred.");
        }
    }

}
