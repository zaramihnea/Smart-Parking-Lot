package com.smartparkinglot.backend.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class PaymentDetailsDTO {

    private String userEmail;
    private Double amount;

    public PaymentDetailsDTO(String userEmail, Double amount) {
        this.userEmail = userEmail;
        this.amount = amount;
    }

    @Override
    public String toString() {
        return "PaymentDetailsDTO{" +
                "userEmail='" + userEmail + '\'' +
                ", amount=" + amount +
                '}';
    }
}
