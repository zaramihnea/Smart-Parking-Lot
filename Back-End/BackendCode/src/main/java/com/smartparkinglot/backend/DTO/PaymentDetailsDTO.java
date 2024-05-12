package com.smartparkinglot.backend.DTO;


import com.fasterxml.jackson.annotation.JsonProperty;

public class PaymentDetailsDTO {

    @JsonProperty("userEmail")
    private String userEmail;
    @JsonProperty("price")
    private double price;

    public String getUserEmail() {
        return userEmail;
    }

    public double getPrice() {
        return price;
    }

    public PaymentDetailsDTO(String userEmail, double price) {
        this.userEmail = userEmail;
        this.price = price;
    }

    @Override
    public String toString() {
        return "PaymentDetailsDTO{" +
                "userEmail='" + userEmail + '\'' +
                ", price=" + price +
                '}';
    }
}
