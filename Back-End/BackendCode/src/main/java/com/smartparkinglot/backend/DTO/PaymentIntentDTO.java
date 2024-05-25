package com.smartparkinglot.backend.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter @Setter
public class PaymentIntentDTO {
    private String id;
    private Double amount;
    private String currency;
    private String description;
    private Date created;

    public void setCreatedFromTimestamp(Long timestamp) {
        this.created = new Date(timestamp * 1000);// Convert seconds to milliseconds
    }

}
