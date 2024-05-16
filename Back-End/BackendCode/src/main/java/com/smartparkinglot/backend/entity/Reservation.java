package com.smartparkinglot.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.sql.Timestamp;

@Entity
@Setter @Getter
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "car_id", referencedColumnName = "id", foreignKey = @ForeignKey(name = "fk_car"))
    private Car car_id;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "parking_spot_id", referencedColumnName = "id", foreignKey = @ForeignKey(name = "fk_parking_spot"))
    private ParkingSpot parkingSpot;

    @Column(name = "start_time")
    private Timestamp startTime;

    @Column(name = "stop_time")
    private Timestamp stopTime;

    @Column(name = "status", length = 15)
    private String status;

    public Reservation() {
    }

    public Reservation(Car car, ParkingSpot parkingSpot, Timestamp startTime, Timestamp stopTime, String status) {
        this.car_id = car;
        this.parkingSpot = parkingSpot;
        this.startTime = startTime;
        this.stopTime = stopTime;
        this.status = status;
    }
    public Reservation(ParkingSpot parkingSpot, Timestamp startTime, Timestamp stopTime, String status) {
        this.parkingSpot = parkingSpot;
        this.startTime = startTime;
        this.stopTime = stopTime;
        this.status = status;
    }
}
