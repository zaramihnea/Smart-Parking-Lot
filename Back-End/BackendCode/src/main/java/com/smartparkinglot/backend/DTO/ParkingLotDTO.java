package com.smartparkinglot.backend.DTO;

import com.smartparkinglot.backend.entity.ParkingLot;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class ParkingLotDTO {
    private Long id;
    private String adminEmail;
    private String name;
    private Integer nrSpots;
    private Float price;
    private BigDecimal latitude;
    private BigDecimal longitude;
    public ParkingLotDTO(ParkingLot parkingLot) {
        this.id = parkingLot.getId();
        this.adminEmail = parkingLot.getUser().getEmail();
        this.name = parkingLot.getName();
        this.nrSpots = parkingLot.getNrSpots();
        this.price = parkingLot.getPrice();
        this.latitude = parkingLot.getLatitude();
        this.longitude = parkingLot.getLongitude();
    }
}
