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

    // 1 - CLIENT # 2 - MANAGER PARCARE # 3 - ADMIN
    @Setter
    @Getter
    @Column(nullable = false)
    private int type;


    @Getter @Setter
    @Column(name = "stripe_account_id")
    private String stripeAccountId;


    public User() {
    }

    //constructor
    // Method for user that logs in from the app. A user that logs in from the app can only be CLIENT
    public User(String email, String name, String password, Date dob, String country, String city, Double balance) {
        this.password = password;
        this.type = 1;
        this.email = email;
        this.dob = dob;
        this.country = country;
        this.city = city;
        this.balance = balance;
        this.name = name;
        this.stripeAccountId = "";
    }

    public User(String email, String name, String password, Date dob, String country, String city, Double balance, int type) {
        this.password = password;
        this.type = type;
        this.email = email;
        this.dob = dob;
        this.country = country;
        this.city = city;
        this.balance = balance;
        this.name = name;
        this.stripeAccountId = "";
    }

    @Override
    public String toString() {
        return "User{" +
                "email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", password='" + password + '\'' +
                ", dob=" + dob +
                ", country='" + country + '\'' +
                ", city='" + city + '\'' +
                ", balance=" + balance +
                ", type=" + type +
                ", stripeAccountId='" + stripeAccountId + '\'' +
                '}';
    }
}
