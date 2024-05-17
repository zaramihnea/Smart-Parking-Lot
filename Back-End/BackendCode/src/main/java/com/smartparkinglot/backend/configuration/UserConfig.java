package com.smartparkinglot.backend.configuration;

import com.smartparkinglot.backend.entity.User;
import com.smartparkinglot.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Example;

import java.util.Date;

@Configuration
public class UserConfig {

    //aici am incercat sa adaug niste inregistrati in tabelul users din baza de date si a functionat
    //las comentariu ca sa nu mai fie adaugate o data

    @Bean
    CommandLineRunner commandLineRunner(UserRepository userRepository){
        return args -> {
            User user1 = new User(
                    "cosmina_baciu@gmail.com",
                    "cosmina_baciu",
                    "84732saf",
                    new Date(1999, 11, 10),
                    "Romania",
                    "Iasi",
                    57.00,
                    false,
                    1
            );

            User user2 = new User(
                    "baciu_elena@gmail.com",
                    "baciu_elena",
                    "84732saf",
                    new Date(1999, 11, 10),
                    "Romania",
                    "Iasi",
                    57.00,
                    false,
                    3
            );
            userRepository.save(user1);

            userRepository.save(user2);
        };
    }

}
