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
    private final EmailService emailService;

    @Autowired
    public UserController(UserService userService, TokenService tokenService, EmailService emailService) {
        this.userService = userService;
        this.tokenService = tokenService;
        this.emailService = emailService;
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
            User user = new User(registerRequest.getEmail(), registerRequest.getName(), registerRequest.getPassword(), registerRequest.getDob(), registerRequest.getCountry(), registerRequest.getCity(), 0.0, false);
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
        if(userService.existsByEmail(loginRequest.getEmail())) {

            boolean isAuthenticated = userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
            User loggedInUser = userService.getUserByEmail(loginRequest.getEmail());
            String generatedToken = tokenService.generateToken(loggedInUser);

            if (isAuthenticated) {
                return ResponseEntity.ok(new JwtResponse(generatedToken, "Bearer"));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login Failed");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login Failed");
    }

    @PostMapping(value = "/reset-password-request")
    public ResponseEntity<String> resetPasswordRequest(@RequestBody ResetPasswordRequest resetPasswordRequest){
        if(userService.existsByEmail(resetPasswordRequest.getEmail())){
            //determin user-ul si generez un token unic pentru acesta
            User user = userService.getUserByEmail(resetPasswordRequest.getEmail());
            String generatedToken = tokenService.generateToken(user);

            //construiesc linkul care va fi trimis prim email utilizatorului
            String resetPasswordLink = "https://localhost:8081/reset_password?token=" + generatedToken;

            emailService.sendResetPasswordEmail(user.getEmail(), resetPasswordLink);

            return ResponseEntity.ok("Email send");

        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email not found");
    }

    @PostMapping(value = "/after-reset-password-request")
    public ResponseEntity<?> afterResetPasswordRequest(@RequestBody AfterResetPasswordRequest afterResetPasswordRequest){
        String token = afterResetPasswordRequest.getToken();
        String password = afterResetPasswordRequest.getPassword();
        if(tokenService.validateToken(token)){
            User user = tokenService.getUserByToken(token); // Obtinem user-ul in functie de token
            userService.changePassword(user, password);
            return ResponseEntity.ok("Password reseted successfully");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
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

    @Getter @Setter
    public static class ResetPasswordRequest{
        private String email;
    }

    @Getter @Setter
    public static class AfterResetPasswordRequest{
        private String token;
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
