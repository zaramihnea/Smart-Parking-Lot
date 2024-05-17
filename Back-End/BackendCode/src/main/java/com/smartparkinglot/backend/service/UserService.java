package com.smartparkinglot.backend.service;

import com.smartparkinglot.backend.customexceptions.EmailExistsException;
import com.smartparkinglot.backend.customexceptions.UserIsBannedException;
import com.smartparkinglot.backend.customexceptions.UsernameExistsException;
import com.smartparkinglot.backend.entity.User;
import com.smartparkinglot.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User saveUser(User user){
        return userRepository.save(user);
    }

    public User getUserById(String id){
        return userRepository.findById(id).orElse(null);
    }
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public void deleteUserById(String id){
        userRepository.deleteById(id);
    }


    public void register(User user) throws UsernameExistsException, EmailExistsException, UserIsBannedException {

//        if( userRepository.isBanned(user.getEmail()) ){
//            throw new UserIsBannedException("User is banned");
//        }

        boolean emailExists = userRepository.existsByEmail(user.getEmail());

        if(emailExists) {
            throw new EmailExistsException("Email taken");
        }

        userRepository.save(user);
    }
    // Method to authenticate user using the TryLogin function
    public boolean authenticateUser(String email, String password) {
        return userRepository.tryLogin(email, password);
    }

    public void updateUserBalance(String email, double amount) {
        userRepository.updateBalanceByEmail(email, amount);
    }

    public void changePassword(User user, String password){
        user.setPassword(password);
        userRepository.save(user);
    }

}
