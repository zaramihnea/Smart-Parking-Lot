package com.smartparkinglot.backend.configuration;

import com.smartparkinglot.backend.entity.User;
import com.smartparkinglot.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.Date;
import java.util.List;
import javax.xml.crypto.Data;

@Configuration
public class UserConfig {

    //aici am incercat sa adaug niste inregistrati in tabelul users din baza de date si a functionat
    //las comentariu ca sa nu mai fie adaugate o data
    /*
    @Bean
    CommandLineRunner commandLineRunner(UserRepository userRepository){
        return args -> {
            User user1 = new User(
                   "cosmina_baciu",
                   "84732saf",
                   User.UserType.REGULAR,
                    "cosmina_baciu@gmail.com",
                    new Date(1999, 12, 10),
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

            userRepository.saveAll(
                    List.of(user1, user2)
            );
        };
    }
    */
}
