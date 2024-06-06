package com.smartparkinglot.backend.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class PaymentDetailsDTO {

    private String email;
    private Double amount;
    private Long parkingSpotId;

    public PaymentDetailsDTO(String email, Double amount, Long parkingSpotId) {
        this.email = email;
        this.amount = amount;
        this.parkingSpotId = parkingSpotId;
    }

}
