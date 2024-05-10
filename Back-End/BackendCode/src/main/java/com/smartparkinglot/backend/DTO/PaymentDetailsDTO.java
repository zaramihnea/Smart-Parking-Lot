package com.smartparkinglot.backend.DTO;


import com.fasterxml.jackson.annotation.JsonProperty;

public class PaymentDetailsDTO {
    @JsonProperty("parkingSpotId")
    private String parkingSpotId;
    @JsonProperty("userMail")
    private String userMail;
    @JsonProperty("amount")
    private long amount;

    public String getParkingSpotId() {
        return parkingSpotId;
    }
    public void setParkingSpotId(String parkingSpotId) {
        this.parkingSpotId = parkingSpotId;
    }

    public String getUserMail() {
        return userMail;
    }
    public void setUserMail(String userMail) {
        this.userMail = userMail;
    }

    public long getAmount() {
        return amount;
    }
    public void setAmount(long amount) {
        this.amount = amount;
    }

    public PaymentDetailsDTO(String parkingSpotId, String userMail, long amount) {
        this.parkingSpotId = parkingSpotId;
        this.userMail = userMail;
        this.amount = amount;
    }
}
