package com.smartparkinglot.backend.controller;
import com.smartparkinglot.backend.DTO.*;
import com.smartparkinglot.backend.customexceptions.EmailExistsException;
import com.smartparkinglot.backend.customexceptions.UsernameExistsException;
import com.stripe.exception.StripeException;
import com.stripe.model.issuing.Authorization;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.smartparkinglot.backend.service.*;
import com.smartparkinglot.backend.entity.*;

import java.net.URI;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    private final TokenService tokenService;
    private final EmailService emailService;
    private final PaymentService paymentService;

    @Autowired
    public UserController(UserService userService, TokenService tokenService, EmailService emailService, PaymentService paymentService) {
        this.userService = userService;
        this.tokenService = tokenService;
        this.emailService = emailService;
        this.paymentService = paymentService;
    }

    @GetMapping(value = "/username")
    public ResponseEntity<String> getUsernameByEmail(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);// Assuming the scheme is "Bearer "
        if(tokenService.validateToken(token)) {
            User userAuthorized = tokenService.getUserByToken(token);
            return ResponseEntity.ok(userAuthorized.getName());
        }
        else {
            return ResponseEntity.badRequest().body("Invalid token");
        }
    }

    @GetMapping(value = "/type")
    public ResponseEntity<String> getUserType(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);// Assuming the scheme is "Bearer "
        if(tokenService.validateToken(token)) {
            User userAuthorized = tokenService.getUserByToken(token);
            return ResponseEntity.ok(String.valueOf(userAuthorized.getType()));
        }
        else {
            return ResponseEntity.badRequest().body("Invalid token");
        }
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

    @GetMapping( "/balance")
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
            User user = new User(registerRequest.getEmail(), registerRequest.getName(), registerRequest.getPassword(), registerRequest.getDob(), registerRequest.getCountry(), registerRequest.getCity(), 0.0);
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
            User userToLog = userService.getUserByEmail(loginRequest.getEmail());
            System.out.println(loginRequest.getPassword());

            boolean isAuthenticated = userService.authenticateUser(userToLog.getEmail(), loginRequest.getPassword());
            String generatedToken = tokenService.generateToken(userToLog);

            if (isAuthenticated) {
                return ResponseEntity.ok(new JwtResponse(generatedToken, "Bearer"));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User doesn't exist");
    }

    @PostMapping(value = "/reset-password-request")
    public ResponseEntity<String> resetPasswordRequest(@RequestBody ResetPasswordRequest resetPasswordRequest){
        if(userService.existsByEmail(resetPasswordRequest.getEmail())){
            //determin user-ul si generez un token unic pentru acesta
            User user = userService.getUserByEmail(resetPasswordRequest.getEmail());

            // verificam daca exista deja un token pentru user-ul dat
            String token = tokenService.generateToken(user);

            //construiesc linkul care va fi trimis prim email utilizatorului
            String resetPasswordLink =  "https://api.smartparkinglot.online/reset-password?token=" + token;

            emailService.sendResetPasswordEmail(user.getEmail(), resetPasswordLink);

            return ResponseEntity.ok("Email sent");

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


    // Payment endpoints
    @GetMapping(value = "/get-stripe-balance")
    public ResponseEntity<?> getCustomerBalance(@RequestParam("email") String customerEmail) {
        try {
            Double balance = paymentService.retrieveCustomerBalance(customerEmail);
            return ResponseEntity.ok(balance);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("No customer found with email")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            } else if (e.getCause() instanceof StripeException) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving customer balance from Stripe");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
            }
        }
    }

    @GetMapping(value = "/get-transactions-history")
    public ResponseEntity<?> getCustomerTransactionsHistory(@RequestParam("email") String customerEmail) {
        try {
            List<TransactionDTO> transactions = paymentService.getTransactionsHistory(customerEmail);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/pay-for-parking-spot")
    public ResponseEntity<?> payForParkingSpot(@RequestBody PaymentDetailsDTO paymentDetails) {
        String response = paymentService.payForParkingSpot(paymentDetails);
        return ResponseEntity.ok(response);
    }

    //we dont access these directly
    @PostMapping("/create-payment-intent")
    public ResponseEntity<PaymentResponseDTO> createPaymentIntent(@RequestBody PaymentDetailsDTO paymentRequest) {
        PaymentResponseDTO response = paymentService.createPaymentIntent(paymentRequest);
        return ResponseEntity.ok(response);
    }

    /*
    @GetMapping("/after-payment-processing")
    public ResponseEntity<?> handlePaymentStatus(@RequestParam("payment_intent") String paymentIntentId) {
        String result = paymentService.handlePaymentResult(paymentIntentId);
        return ResponseEntity.ok(result);
    }
    */

    @GetMapping("/after-payment-processing")
    public ResponseEntity<?> handlePaymentStatus(@RequestParam("payment_intent") String paymentIntentId, HttpServletRequest request) {
        String result = paymentService.handlePaymentResult(paymentIntentId);

        if ("success".equals(result)) {
            // Redirect to the homepage if the payment was successful
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("https://api.smartparkinglot.online/balance")).build();
        } else {
            return ResponseEntity.ok(result);
        }
    }

    //stripe onboarding endpoints
    @PostMapping("/create-stripe-account")
    public ResponseEntity<?> createAccount(@RequestBody PaymentService.CreateAccountRequest request) {
        return paymentService.createStripeAccount(request);
    }

    @PostMapping("/create-account-link")
    public ResponseEntity<?> createAccountLink(@RequestBody PaymentService.CreateAccountLinkRequest request) {
        return paymentService.createStripeAccountLink(request);
    }

    @GetMapping("/return")
    public ResponseEntity<?> handleStripeRedirect(@RequestParam(value = "accountId", required = false) String accountId) {
        return paymentService.handleStripeReturn(accountId);
    }


    @GetMapping(value = "/details")
    public ResponseEntity<?> getUserDetails(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7); // Assuming the scheme is "Bearer "
        if(tokenService.validateToken(token)) {
            User userAuthorized = tokenService.getUserByToken(token);
            UserDetailsResponse userDetails = new UserDetailsResponse(
                    userAuthorized.getEmail(),
                    userAuthorized.getName(),
                    userAuthorized.getCity(),
                    userAuthorized.getCountry()
            );
            return ResponseEntity.ok(userDetails);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    @GetMapping(value = "/favorite-lot")
    public ResponseEntity<String> getFavoriteLot(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);// Assuming the scheme is "Bearer "
        if(tokenService.validateToken(token)) {
            User userAuthorized = tokenService.getUserByToken(token);
            return ResponseEntity.ok(String.valueOf(userService.getFavoriteLot(userAuthorized)));
        }
        else {
            return ResponseEntity.badRequest().body("Invalid token");
        }
    }

    @Getter @Setter
    public static class UserDetailsResponse {
        private String email;
        private String name;
        private String city;
        private String country;

        public UserDetailsResponse(String email, String name, String city, String country) {
            this.email = email;
            this.name = name;
            this.city = city;
            this.country = country;
        }
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
        private String baseUrl;
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
