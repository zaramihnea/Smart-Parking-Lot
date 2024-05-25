package com.smartparkinglot.backend.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class PaymentDetailsDTO {

    private String email;
    private Double amount;

    public PaymentDetailsDTO(String email, Double amount) {
        this.email = email;
        this.amount = amount;
    }

}
