package com.smartparkinglot.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "users")
public class User {

    //datele memebre care reprezinta coloanele din tabele "users"
    @Getter @Setter
    @Id
    @Column(nullable = false, unique = true)
    private String email;

    @Setter
    @Getter
    @Column
    private String name;

    @Setter
    @Getter
    @Column(nullable = false)
    private String password;

    @Setter
    @Getter
    @Column
    private Date dob;

    @Setter
    @Getter
    @Column
    private String country;

    @Getter
    @Setter
    @Column
    private String city;

    @Setter
    @Getter
    @Column
    private Double balance;

    @Setter
    @Getter
    @Column(nullable = false)
    private int type;

    @Setter
    @Getter
    @Column
    private Boolean isBanned;


    public User() {
    }

    //constructor
    public User(String email, String name, String password, Date dob, String country, String city, Double balance, Boolean isBanned, int type) {
        this.password = password;
        this.type = type;
        this.email = email;
        this.dob = dob;
        this.country = country;
        this.city = city;
        this.balance = balance;
        this.name = name;
        this.isBanned = isBanned;
    }

}
