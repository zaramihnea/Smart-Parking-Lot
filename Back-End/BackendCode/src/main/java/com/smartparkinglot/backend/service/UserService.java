package com.smartparkinglot.backend.service;

import com.smartparkinglot.backend.customexceptions.EmailExistsException;
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

    public User getUserById(Long id){
        return userRepository.findById(id).orElse(null);
    }
    public User getUserByName(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public void deleteUserById(Long id){
        userRepository.deleteById(id);
    }


    public void register(User user) throws UsernameExistsException, EmailExistsException {
        boolean usernameExists = userRepository.existsByUsername(user.getUsername());
        boolean emailExists = userRepository.existsByEmail(user.getEmail());

        if (usernameExists) {
            throw new UsernameExistsException("Username taken");
        } else if(emailExists) {
            throw new EmailExistsException("Email taken");
        }

        userRepository.save(user);
    }
    // Method to authenticate user using the TryLogin function
    public boolean authenticateUser(String username, String password) {
        return userRepository.tryLogin(username, password);
    }

}
