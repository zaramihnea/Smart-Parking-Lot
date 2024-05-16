package com.smartparkinglot.backend.configuration;

import com.smartparkinglot.backend.entity.Car;
import com.smartparkinglot.backend.entity.Card;
import com.smartparkinglot.backend.entity.User;
import com.smartparkinglot.backend.repository.CarRepository;
import com.smartparkinglot.backend.repository.CardRepository;
import com.smartparkinglot.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Example;

@Configuration
public class CarConfig {
    @Bean
    CommandLineRunner carCommandLineRunner(CarRepository carRepository, UserRepository userRepository) {
        return args -> {
            User user1 = userRepository.
                    findByEmail("cosmina_baciu@gmail.com").orElse(null);
            User user2 = userRepository.
                    findByEmail("baciu_elena@gmail.com").orElse(null);

            Car car1 = new Car(1L, "B201ABC", 201, "regular", user1);
            Car car2 = new Car(2L, "IS21DEF", 402, "regular", user2);

            if(!carRepository.exists(Example.of(car1)))carRepository.save(car1);
            if(!carRepository.exists(Example.of(car2)))carRepository.save(car2);
        };
    }
}
