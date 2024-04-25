package com.smartparkinglot.backend.configuration;

import com.smartparkinglot.backend.entity.Plate;
import com.smartparkinglot.backend.entity.User;
import com.smartparkinglot.backend.repository.PlateRepository;
import com.smartparkinglot.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Example;

import java.util.Date;
import java.util.Optional;

@Configuration
public class PlateConfig {
    @Bean
    CommandLineRunner plateCommandLineRunner(PlateRepository plateRepository, UserRepository userRepository) {
        return args -> {
            User user1 = userRepository.
                    findByUsername("cosmina_baciu");
            User user2 = userRepository.
                    findByUsername("baciu_elena");

            Plate plate1 = new Plate("B012ABC", user1);
            Plate plate2 = new Plate("IS12CDE", user2);

            if(!plateRepository.exists(Example.of(plate1)))plateRepository.save(plate1);
            if(!plateRepository.exists(Example.of(plate2)))plateRepository.save(plate2);
        };
    }

}
