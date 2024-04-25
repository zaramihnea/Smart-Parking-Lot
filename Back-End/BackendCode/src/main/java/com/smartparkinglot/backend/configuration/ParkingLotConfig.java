package com.smartparkinglot.backend.configuration;

import com.smartparkinglot.backend.entity.ParkingLot;
import com.smartparkinglot.backend.repository.ParkingLotRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Example;

@Configuration
public class ParkingLotConfig {
    @Bean
    CommandLineRunner parkingLotCommandLineRunner(ParkingLotRepository parkingLotRepository) {
        return args -> {
            ParkingLot parkingLot1 = new ParkingLot("PL1", 50, 47.1234, 27.5432);
            ParkingLot parkingLot2 = new ParkingLot("PL2", 30, 47.5678, 27.9876);

            if(!parkingLotRepository.exists(Example.of(parkingLot1)))parkingLotRepository.save(parkingLot1);
            if(!parkingLotRepository.exists(Example.of(parkingLot2)))parkingLotRepository.save(parkingLot2);
        };
    }
}
