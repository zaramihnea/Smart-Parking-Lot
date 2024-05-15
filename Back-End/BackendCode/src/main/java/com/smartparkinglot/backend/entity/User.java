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

    @Getter
    @Setter
    @Column(nullable = false, unique = true)
    private String username;

    @Setter
    @Getter
    @Column(nullable = false)
    private String password;

    @Setter
    @Getter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType type;


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
    public enum UserType {
        ADMIN,
        REGULAR
    }

    public User() {
    }

    //constructor
    public User(String username, String password, UserType type, String email, Date dob, String country, String city, Double balance) {
        this.username = username;
        this.password = password;
        this.type = type;
        this.email = email;
        this.dob = dob;
        this.country = country;
        this.city = city;
        this.balance = balance;
    }

}
