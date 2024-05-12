package com.smartparkinglot.backend.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PaymentResponseDTO {
    @JsonProperty("clientSecret")
    private String clientSecret;

    @JsonProperty("paymentIntentID")
    private String paymentIntentID;

    public PaymentResponseDTO(String clientSecret, String paymentIntentID) {
        this.clientSecret = clientSecret;
        this.paymentIntentID = paymentIntentID;
    }

    public String getPaymentIntentID() {
        return paymentIntentID;
    }

    public String getClientSecret() {
        return clientSecret;
    }
}