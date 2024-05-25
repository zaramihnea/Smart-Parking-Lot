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

            if(user1 == null || user2 == null) return;
            Car car1 = new Car("B201ABC", 201, "Sedan", user2);
            Car car2 = new Car("IS21DEF", 402, "SUV", user2);
            Car car3 = new Car("B321DEF", 402, "Volkswagen Golf", user2);

            if(!carRepository.exists(Example.of(car1)))carRepository.save(car1);
            if(!carRepository.exists(Example.of(car2)))carRepository.save(car2);
            if(!carRepository.exists(Example.of(car3)))carRepository.save(car3);
        };
    }
}
