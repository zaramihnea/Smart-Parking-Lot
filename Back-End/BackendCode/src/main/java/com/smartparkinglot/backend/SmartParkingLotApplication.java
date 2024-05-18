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
        Dotenv dotenv = Dotenv.load();
        System.setProperty("spring.datasource.username", dotenv.get("DB_USERNAME"));
        System.setProperty("spring.datasource.password", dotenv.get("DB_PASSWORD"));

        System.setProperty("stripe.apiKey", dotenv.get("STRIPE_API_KEY"));

        System.setProperty("spring.mail.host", dotenv.get("SPRING_MAIL_HOST"));
        System.setProperty("spring.mail.port", dotenv.get("SPRING_MAIL_PORT"));
        System.setProperty("spring.mail.username", dotenv.get("SPRING_MAIL_USERNAME"));
        System.setProperty("spring.mail.password", dotenv.get("SPRING_MAIL_PASSWORD"));

        SpringApplication.run(SmartParkingLotApplication.class, args);
    }


}
