package com.smartparkinglot.backend.configuration;

import com.smartparkinglot.backend.entity.ParkingLot;
import com.smartparkinglot.backend.entity.ParkingSpot;
import com.smartparkinglot.backend.repository.ParkingLotRepository;
import com.smartparkinglot.backend.repository.ParkingSpotRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Optional;

@Configuration
public class ParkingSpotConfig {
    @Bean
    CommandLineRunner parkingSpotDataLoader(ParkingSpotRepository parkingSpotRepository, ParkingLotRepository parkingLotRepository) {
        return args -> {
            Optional<ParkingLot> optionalParkingLot1 = parkingLotRepository
                    .findById("PL1");
            Optional<ParkingLot> optionalParkingLot2 = parkingLotRepository
                    .findById("PL2");

            ParkingLot parkingLot1 = optionalParkingLot1.get();
            ParkingLot parkingLot2 = optionalParkingLot2.get();

            ParkingSpot parkingSpot1 = new ParkingSpot("PS1", parkingLot1, "available", 47.1235, 27.5433);
            ParkingSpot parkingSpot2 = new ParkingSpot("PS2", parkingLot1, "occupied", 47.1236, 27.5434);
            ParkingSpot parkingSpot3 = new ParkingSpot("PS3", parkingLot2, "available", 47.5679, 27.9877);
            ParkingSpot parkingSpot4 = new ParkingSpot("PS4", parkingLot2, "available", 47.5680, 27.9878);

            parkingSpotRepository.save(parkingSpot1);
            parkingSpotRepository.save(parkingSpot2);
            parkingSpotRepository.save(parkingSpot3);
            parkingSpotRepository.save(parkingSpot4);
        };
    }
}
