package com.smartparkinglot.backend.configuration;

import com.smartparkinglot.backend.entity.ParkingLot;
import com.smartparkinglot.backend.repository.ParkingLotRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Example;

import java.math.BigDecimal;

@Configuration
public class ParkingLotConfig {
    @Bean
    CommandLineRunner parkingLotCommandLineRunner(ParkingLotRepository parkingLotRepository) {
        return args -> {
            ParkingLot parkingLot1 = new ParkingLot("PL1", 50L, new BigDecimal("81.1230"), new BigDecimal("27.1234"));
            ParkingLot parkingLot2 = new ParkingLot("PL2", 30L, new BigDecimal("47.8234"), new BigDecimal("27.8034"));

            if(!parkingLotRepository.exists(Example.of(parkingLot1)))parkingLotRepository.save(parkingLot1);
            if(!parkingLotRepository.exists(Example.of(parkingLot2)))parkingLotRepository.save(parkingLot2);
        };
    }
}
