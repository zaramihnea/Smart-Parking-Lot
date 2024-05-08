package com.smartparkinglot.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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

    @Column(name = "status", length = 11, columnDefinition = "VARCHAR(11) DEFAULT 'available'")
    private String status;

    @Getter @Setter
    @Column(name = "ownerID", nullable = true)
    private Long ownerUserID;  // Stores the ID of the User that owns the spot


    public ParkingSpot() {
    }
    public ParkingSpot(ParkingLot parkingLot, String status) {
        this.parkingLot = parkingLot;
        this.status = status;
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
