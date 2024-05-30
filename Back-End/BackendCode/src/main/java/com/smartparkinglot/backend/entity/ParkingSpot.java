package com.smartparkinglot.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Table(name = "parking_spots")
public class ParkingSpot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", length = 11)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "parking_lot_id", referencedColumnName = "id", foreignKey = @ForeignKey(name = "FK_parking_spots_parking_lots"), nullable = false)
    private ParkingLot parkingLot;

    @Getter @Setter
    @Column(name = "status")
    private String status;

    @Getter @Setter
    @Column(name = "plate", length = 7)
    private String plate;

    @Getter @Setter
    @Column(name = "name", length = 15)
    private String name;

    public ParkingSpot() {
    }
    public ParkingSpot(ParkingLot parkingLot) {
        this.parkingLot = parkingLot;
    }

    public ParkingLot getParkingLot() {
        return parkingLot;
    }

    public void setParkingLot(ParkingLot parkingLot) {
        this.parkingLot = parkingLot;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
