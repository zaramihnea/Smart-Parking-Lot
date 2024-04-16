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
                   "cosmina_baciu",
                   "84732saf",
                   User.UserType.REGULAR,
                    "cosmina_baciu@gmail.com",
                    new Date(1999, 11, 10),
                    "Romania",
                    "Iasi",
                    57.00
            );

            User user2 = new User(
                    "baciu_elena",
                    "fd8473fs2saf",
                    User.UserType.REGULAR,
                    "baciu33@gmail.com",
                    new Date(1994, 9, 30),
                    "Romania",
                    "Iasi",
                    517.00
            );
            Example<User> exampleUser1 = Example.of(user1);
            Example<User> exampleUser2 = Example.of(user2);
            if(!userRepository.exists(exampleUser1)) {
                userRepository.save(user1);
            }
            if(!userRepository.exists(exampleUser2)) {
                userRepository.save(user2);
            }
        };
    }

}
