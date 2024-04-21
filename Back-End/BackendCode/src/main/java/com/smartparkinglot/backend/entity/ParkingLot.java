package com.smartparkinglot.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "parking_lots")
public class ParkingLot {
    @Id
    @Column(name = "id", length = 11)
    private String id;

    @Column(name = "nr_spots")
    private int numberOfSpots;

    @Column(name = "latitude")
    private double latitude;

    @Column(name = "longitude")
    private double longitude;

    public ParkingLot() {
    }

    public ParkingLot(String id, int numberOfSpots, double latitude, double longitude) {
        this.id = id;
        this.numberOfSpots = numberOfSpots;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getNumberOfSpots() {
        return numberOfSpots;
    }

    public void setNumberOfSpots(int numberOfSpots) {
        this.numberOfSpots = numberOfSpots;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
}
