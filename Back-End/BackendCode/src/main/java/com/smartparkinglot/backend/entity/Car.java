package com.smartparkinglot.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cars")
public class Car {
    @Id
    @Column(name = "plate", length = 7)
    private String plate;

    @Column(name = "capacity")
    private int capacity;

    @Column(name = "type", length = 35)
    private String type;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "email", referencedColumnName = "email")
    private User user;

    public Car() {
    }

    public Car(String plate, int capacity, String type, User user) {
        this.plate = plate;
        this.capacity = capacity;
        this.type = type;
        this.user = user;
    }

    public String getPlate() {
        return plate;
    }

    public void setPlate(String plate) {
        this.plate = plate;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
