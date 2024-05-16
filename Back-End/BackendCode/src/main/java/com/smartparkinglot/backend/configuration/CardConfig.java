package com.smartparkinglot.backend.configuration;

import com.smartparkinglot.backend.entity.Card;
import com.smartparkinglot.backend.entity.ParkingLot;
import com.smartparkinglot.backend.entity.User;
import com.smartparkinglot.backend.repository.CardRepository;
import com.smartparkinglot.backend.repository.ParkingLotRepository;
import com.smartparkinglot.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Example;

@Configuration
public class CardConfig {
    @Bean
    CommandLineRunner cardCommandLineRunner(CardRepository cardRepository, UserRepository userRepository) {
        return args -> {
            User user1 = userRepository.
                    findByEmail("cosmina_baciu@gmail.com").orElse(null);
            User user2 = userRepository.
                    findByEmail("baciu_elena@gmail.com").orElse(null);

            Card card1 = new Card(1L, "9375310191321441", user1);
            Card card2 = new Card(2L, "1121783382244824", user2);

            if(!cardRepository.exists(Example.of(card1)))cardRepository.save(card1);
            if(!cardRepository.exists(Example.of(card2)))cardRepository.save(card2);
        };
    }
}
