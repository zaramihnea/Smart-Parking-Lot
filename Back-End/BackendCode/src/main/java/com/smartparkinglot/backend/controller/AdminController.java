package com.smartparkinglot.backend.controller;
import com.smartparkinglot.backend.DTO.RefundRequest;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.smartparkinglot.backend.service.*;
import com.smartparkinglot.backend.entity.*;

import java.util.List;


@RestController
@RequestMapping("/admin")
public class AdminController {
    private final UserService userService;
    private final TokenService tokenService;
    private final ParkingLotService parkingLotService;
    private final PaymentService paymentService;

    @Autowired
    public AdminController(UserService userService, TokenService tokenService, ParkingLotService parkingLotService, PaymentService paymentService) {
        this.userService = userService;
        this.tokenService = tokenService;
        this.parkingLotService = parkingLotService;
        this.paymentService = paymentService;
    }

    @GetMapping(value = "/all-users")
    public ResponseEntity<?> getAllUsers(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);// Assuming the scheme is "Bearer "
        if(tokenService.validateToken(token)) {
            User userAuthorized = tokenService.getUserByToken(token);
            if(userAuthorized.getType() == 3) {
                return ResponseEntity.ok(userService.findAll());
            }
            else {
                return ResponseEntity.badRequest().body("User is not admin");
            }
        }
        else {
            return ResponseEntity.badRequest().body("Invalid token");
        }
    }


    @PostMapping(value = "/ban/{email}")
    public ResponseEntity<String> banUser(@RequestHeader("Authorization") String authorizationHeader, @PathVariable("email") String email) {
        String token = authorizationHeader.substring(7);// Assuming the scheme is "Bearer "
        if(tokenService.validateToken(token)) {
            User userAuthorized = tokenService.getUserByToken(token);
            if(userAuthorized.getType() == 3) {
                try {
                    User user = userService.getUserByEmail(email);
                    userService.banUser(user);
                    return ResponseEntity.ok("User banned successfully");
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while banning the user");
                }
            }
            else {
                return ResponseEntity.badRequest().body("User is not admin");
            }
        }
        else {
            return ResponseEntity.badRequest().body("Invalid token");
        }
    }


    @PostMapping(value = "/delete/{lot}")
    public ResponseEntity<String> deleteParkingLot(@RequestHeader("Authorization") String authorizationHeader, @PathVariable("lot") Long lot) {
        String token = authorizationHeader.substring(7);// Assuming the scheme is "Bearer "
        if(tokenService.validateToken(token)) {
            User userAuthorized = tokenService.getUserByToken(token);
            if(userAuthorized.getType() == 3 || userAuthorized.getType() == 2) {
                ParkingLot parkingLot = parkingLotService.getParkingLotById(lot);

                if(parkingLot == null)
                    return ResponseEntity.badRequest().body("The parking lot does not exist.");

                if(userAuthorized.getType() == 2 && userAuthorized.getEmail().equals(parkingLot.getUser().getEmail())){
                    try {
                        parkingLotService.deleteParkingLot(parkingLot);
                        return ResponseEntity.ok("Parking lot deleted successfully.");
                    } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting parking lot.");
                    }
                } else {
                    return ResponseEntity.badRequest().body("The parking lot has different admin.");
                }
            }
            else {
                return ResponseEntity.badRequest().body("User is not admin");
            }
        }
        else {
            return ResponseEntity.badRequest().body("Invalid token");
        }
    }

    @PostMapping(value = "/set-price/{lot_id}/{price}")
    public ResponseEntity<String> setParkingLotPrice(@RequestHeader("Authorization") String authorizationHeader, @PathVariable("lot_id") Long lot, @PathVariable("price") Float price) {
        String token = authorizationHeader.substring(7);// Assuming the scheme is "Bearer "
        if(tokenService.validateToken(token)) {
            User userAuthorized = tokenService.getUserByToken(token);
            if(userAuthorized.getType() == 3 || userAuthorized.getType() == 2) {
                ParkingLot parkingLot = parkingLotService.getParkingLotById(lot);

                if(parkingLot == null)
                    return ResponseEntity.badRequest().body("The parking lot does not exist.");

                if(userAuthorized.getEmail().equals(parkingLot.getUser().getEmail())){
                    try {
                        parkingLotService.updatePrice(parkingLot, price);
                        return ResponseEntity.ok("Price for the parking lot set successfully.");
                    } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while setting parking lot price.");
                    }
                } else {
                    return ResponseEntity.badRequest().body("The parking lot has different admin.");
                }
            }
            else {
                return ResponseEntity.badRequest().body("User is not admin");
            }
        }
        else {
            return ResponseEntity.badRequest().body("Invalid token");
        }
    }

    @GetMapping("/my-parking-lots")
    public ResponseEntity<?> getAdminsParkingLots(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            String token = authorizationHeader.substring(7); // Assuming the scheme is "Bearer "
            if (!tokenService.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            User userAuthorized = tokenService.getUserByToken(token);
            if (userAuthorized.getType() != 3 && userAuthorized.getType() != 2) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User is not admin");
            }

            List<ParkingLot> parkingLots = parkingLotService.findAllByAdminEmail(userAuthorized);
            return ResponseEntity.ok(parkingLots);
        } catch (IndexOutOfBoundsException e) {
            return ResponseEntity.badRequest().body("Invalid Authorization header format");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }


    @PostMapping("/refund")
    public ResponseEntity<?> refundPayment(@RequestBody RefundRequest refundRequest) {
        try {
            String refundSuccess = paymentService.refundPayment(refundRequest);
            if (refundSuccess.equals("success")) {
                return ResponseEntity.ok("Refund processed successfully");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Refund processing failed");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
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
