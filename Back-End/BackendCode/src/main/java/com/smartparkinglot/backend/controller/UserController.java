package com.smartparkinglot.backend.controller;
import com.smartparkinglot.backend.customexceptions.EmailExistsException;
import com.smartparkinglot.backend.customexceptions.UsernameExistsException;
import com.stripe.model.issuing.Authorization;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.smartparkinglot.backend.service.*;
import com.smartparkinglot.backend.entity.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    private final TokenService tokenService;

    @Autowired
    public UserController(UserService userService, TokenService tokenService) {
        this.userService = userService;
        this.tokenService = tokenService;
    }
    @GetMapping(value = "/email")
    public ResponseEntity<?> getUserID(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);// Assuming the scheme is "Bearer "
        if(tokenService.validateToken(token)) {
            User userAuthorized = tokenService.getUserByToken(token);
            return ResponseEntity.ok(userAuthorized.getEmail());
        }
        else {
            return ResponseEntity.badRequest().body("Invalid token");
        }
    }

    @GetMapping(value = "/balance")
    public ResponseEntity<Double> getUserBalance(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);// Assuming the scheme is "Bearer "
        if(tokenService.validateToken(token)) {
            User userAuthorized = tokenService.getUserByToken(token);
            return ResponseEntity.ok(userAuthorized.getBalance());
        }
        else {
            return ResponseEntity.badRequest().body(-1.0);
        }
    }

    // A post request to /user will register a user in the db
    @PostMapping(value = "/register")
    public ResponseEntity<String> registerNewUser(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = new User(registerRequest.getEmail(), registerRequest.getName(), registerRequest.getPassword(), registerRequest.getDob(), registerRequest.getCountry(), registerRequest.getCity(), 0.0, false, 1);
            userService.register(user);
            return ResponseEntity.ok("User registered successfully");
        } catch (UsernameExistsException | EmailExistsException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Catching any other unexpected exceptions
            return ResponseEntity.internalServerError().body("An unexpected error occurred");
        }
    }
    @PostMapping(value = "/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        if(userService.existsByUsername(loginRequest.getEmail())) {

            boolean isAuthenticated = userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
            User loggedInUser = userService.getUserByName(loginRequest.getEmail());
            String generatedToken = tokenService.generateToken(loggedInUser);

            if (isAuthenticated) {
                return ResponseEntity.ok(new JwtResponse(generatedToken, "Bearer"));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login Failed");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login Failed");
    }

    @Getter
    @Setter
    public static class RegisterRequest {
        private String email;
        private String name;
        private String password;
        private Date dob;
        private String country;
        private String city;
    }

    @Setter @Getter
    public static class LoginRequest {
        private String email;
        private String password;

    }

    @Getter
    public class JwtResponse {
        private String token;
        private String type;

        public JwtResponse(String token, String type) {
            this.token = token;
            this.type = type;
        }

    }
}
