package com.smartparkinglot.backend.controller;
import com.smartparkinglot.backend.customexceptions.EmailExistsException;
import com.smartparkinglot.backend.customexceptions.UsernameExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.smartparkinglot.backend.service.*;
import com.smartparkinglot.backend.entity.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // get request to /user will return all users from db in json format
    @GetMapping
    public List<User> getUsers(){
        return userService.getAllUsers();
    }

    // A post request to /user will register a user in the db
    @PostMapping
    public ResponseEntity<String> registerNewUser(@RequestBody User user) {
        try {
            userService.register(user);
            return ResponseEntity.ok("User registered successfully");
        } catch (UsernameExistsException | EmailExistsException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Catching any other unexpected exceptions
            return ResponseEntity.internalServerError().body("An unexpected error occurred");
        }
    }
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        boolean isAuthenticated = userService.authenticateUser(loginRequest.getUsername(), loginRequest.getPassword());
        User loggedInUser = userService.getUserByName(loginRequest.getUsername());
        if (isAuthenticated) {
            return ResponseEntity.ok("Login Successful");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login Failed");
        }
    }

    static class LoginRequest {
        private String username;
        private String password;

        // Getters and Setters
        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
