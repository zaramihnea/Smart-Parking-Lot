package com.smartparkinglot.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "parking_spots")
public class ParkingSpot {
    @Id
    @Column(name = "id", length = 11)
    private String id;

    @ManyToOne
    @JoinColumn(name = "parking_lot_id", referencedColumnName = "id", foreignKey = @ForeignKey(name = "FK_parking_spots_parking_lots"), nullable = false)
    private ParkingLot parkingLot;

    @Column(name = "status", length = 11, columnDefinition = "VARCHAR(11) DEFAULT 'undefined'")
    private String status;

    @Column(name = "latitude")
    private double latitude;

    @Column(name = "longitude")
    private double longitude;

    public ParkingSpot() {
    }
    public ParkingSpot(String id, ParkingLot parkingLot, String status, double latitude, double longitude) {
        this.id = id;
        this.parkingLot = parkingLot;
        this.status = status;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ParkingLot getParkingLot() {
        return parkingLot;
    }

    public void setParkingLot(ParkingLot parkingLot) {
        this.parkingLot = parkingLot;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
