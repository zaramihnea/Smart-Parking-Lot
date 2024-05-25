package com.smartparkinglot.backend.controller;

import com.smartparkinglot.backend.DTO.PaymentDetailsDTO;
import com.smartparkinglot.backend.DTO.TransactionDTO;
import com.smartparkinglot.backend.DTO.PaymentResponseDTO;
import com.smartparkinglot.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
public class StripeAPIController {
    private final PaymentService paymentService;

    @Autowired
    public StripeAPIController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }


    @PostMapping("/create-payment-intent")
    public ResponseEntity<PaymentResponseDTO> createPaymentIntent(@RequestBody PaymentDetailsDTO paymentRequest) {
        PaymentResponseDTO response = paymentService.createPaymentIntent(paymentRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/after-payment-processing")
    public ResponseEntity<?> handlePaymentStatus(@RequestParam("payment_intent") String paymentIntentId) {
        String result = paymentService.handlePaymentResult(paymentIntentId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/get-customer-balance")
    public ResponseEntity<?> getCustomerBalance(@RequestParam("email") String customerEmail) {
        Double balance = paymentService.retrieveCustomerBalance(customerEmail);
        return ResponseEntity.ok(balance);
    }

    @GetMapping("/get-transactions-history")
    public ResponseEntity<?> getCustomerTransactionsHistory(@RequestParam("email") String customerEmail) {
        try {
            List<TransactionDTO> transactions = paymentService.getTransactionsHistory(customerEmail);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/refund-balance-transaction")
    public ResponseEntity<?> refundBalanceTransaction(@RequestParam("transactionId") String transactionId, @RequestParam("email") String email) {
        String response = paymentService.refundCustomerBalanceTransaction(transactionId, email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/pay-for-parking-spot")
    public ResponseEntity<?> payForParkingSpot(@RequestBody PaymentDetailsDTO paymentDetails) {
        String response = paymentService.payForParkingSpot(paymentDetails.getEmail(), paymentDetails.getAmount());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refund-charge")
    public ResponseEntity<?> refundCharge(@RequestParam("chargeId") String id, @RequestParam("email") String email) {
        String response = paymentService.createCardPaymentRefund(id, email);
        return ResponseEntity.ok(response);
    }

}
