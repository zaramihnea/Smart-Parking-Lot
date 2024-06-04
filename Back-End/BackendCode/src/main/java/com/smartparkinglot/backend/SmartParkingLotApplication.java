package com.smartparkinglot.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.sql.Timestamp;

@SpringBootApplication
@EnableScheduling
@EnableAsync
public class SmartParkingLotApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartParkingLotApplication.class, args);
    }


}
