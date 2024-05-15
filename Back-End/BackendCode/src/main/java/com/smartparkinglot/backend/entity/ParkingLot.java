package com.smartparkinglot.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "parking_lots")
public class ParkingLot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nr_spots")
    private Integer nrSpots;

    @Getter @Setter
    @Column(name = "price")
    private Float price;

    @Column(name = "latitude", precision=10, scale=8)
    private BigDecimal latitude;

    @Column(name = "longitude", precision=10, scale=8)
    private BigDecimal longitude;

    public ParkingLot() {
    }

    public ParkingLot(Long id, int nrSpots, float price, BigDecimal latitude, BigDecimal longitude) {
        this.id = id;
        this.nrSpots = nrSpots;
        this.price = price;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public BigDecimal getLatitude() {
        return latitude;
    }

    public int getNrSpots() {
        return nrSpots;
    }

    public void setNrSpots(int nrSpots) {
        this.nrSpots = nrSpots;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }
}
