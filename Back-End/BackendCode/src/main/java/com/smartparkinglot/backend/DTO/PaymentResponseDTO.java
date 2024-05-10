package com.smartparkinglot.backend.DTO;

public class PaymentResponseDTO {
    private String clientSecret;

    public PaymentResponseDTO(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public String getClientSecret() {
        return clientSecret;
    }
}