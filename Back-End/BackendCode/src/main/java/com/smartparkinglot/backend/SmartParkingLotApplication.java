package com.smartparkinglot.backend;

import com.smartparkinglot.backend.entity.User;
import com.smartparkinglot.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Date;

import static com.smartparkinglot.backend.entity.User.UserType.REGULAR;

@SpringBootApplication
public class SmartParkingLotApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartParkingLotApplication.class, args);
    }

}
