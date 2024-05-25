package com.smartparkinglot.backend.configuration;

import com.smartparkinglot.backend.entity.Car;
import com.smartparkinglot.backend.entity.ParkingSpot;
import com.smartparkinglot.backend.entity.User;
import com.smartparkinglot.backend.repository.ParkingSpotRepository;
import com.smartparkinglot.backend.repository.ReservationRepository;
import com.smartparkinglot.backend.repository.UserRepository;
import com.smartparkinglot.backend.service.CarService;
import com.smartparkinglot.backend.service.ParkingSpotService;
import com.smartparkinglot.backend.service.ReservationService;
import com.smartparkinglot.backend.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.sql.Timestamp;
import java.util.Date;

@Configuration
@Order(7)
public class ReservationConfig {
    @Bean
    CommandLineRunner reservationCommandLineRunner(ReservationService reservationService, UserService userService, ParkingSpotRepository parkingSpotRepository, CarService carService) {
        return args -> {
            User admin = userService.getUserByEmail("baciu_elena@gmail.com");

            if(reservationService.getOwnActiveReservations(admin.getEmail()).size() > 0){
                return;
            }
            ParkingSpot someSpot = parkingSpotRepository.findById(1L).orElse(null);
            ParkingSpot someSpot2 = parkingSpotRepository.findById(2L).orElse(null);
            if(someSpot == null || someSpot2 == null){
                return;
            }

            Car someUserCar = new Car("B123ABC", 4, "Opel Astra", admin);
            carService.addNewCar(someUserCar);

            Timestamp startTimestamp = new Timestamp(new Date().getTime());
            Timestamp endTimestamp = new Timestamp(new Date().getTime() + 1000 * 60 * 60 * 2); // 2 hours from now

            reservationService.createReservation(admin, someSpot.getId(), startTimestamp, endTimestamp, 0, someUserCar);
            reservationService.createReservation(admin, someSpot2.getId(), startTimestamp, endTimestamp, 0, someUserCar);
        };
    }
}
