package com.smartparkinglot.backend.controller;

import com.smartparkinglot.backend.DTO.CarDTO;
import com.smartparkinglot.backend.entity.Car;
import com.smartparkinglot.backend.entity.ParkingLot;
import com.smartparkinglot.backend.entity.User;
import com.smartparkinglot.backend.service.CarService;
import com.smartparkinglot.backend.service.TokenService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.intellij.lang.annotations.JdkConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/car")
public class CarController {
    private final CarService carService;
    private final TokenService tokenService;

    @Autowired
    public CarController(CarService carService, TokenService tokenService) {
        this.carService = carService;
        this.tokenService = tokenService;
    }

    @GetMapping("/user-cars")
    public ResponseEntity<?> getCars(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);// Assuming the scheme is "Bearer "
        if(tokenService.validateToken(token)) {
            User userAuthorized = tokenService.getUserByToken(token);

            return ResponseEntity.ok().body(carService.getCarsByUser(userAuthorized).stream().map(car -> {
                return new CarDTO(car.getId(), car.getPlate(), car.getCapacity(), car.getType());
            }));
        }
        else {
            return ResponseEntity.badRequest().body("Authentication token invalid. Protected resource could not be accessed");
        }
    }

    @PostMapping(value = "/register-car")
    public ResponseEntity<String> registerNewCar(@RequestHeader("Authorization") String authorizationHeader, @RequestBody CarDetails car) {
        String token = authorizationHeader.substring(7);// Assuming the scheme is "Bearer "
        if(tokenService.validateToken(token)) {
            User userAuthorized = tokenService.getUserByToken(token);
            carService.addNewCar(new Car(car.getPlate(), car.getCapacity(), car.getType(), userAuthorized));

            return ResponseEntity.ok().body("Car saved successfully");
        }
        else {
            return ResponseEntity.badRequest().body("Authentication token invalid. Protected resource could not be accessed");
        }
    }

    @DeleteMapping("/delete-car")
    public ResponseEntity<String> deleteCar(@RequestHeader("Authorization") String authorizationHeader, @RequestBody CarDetails car) {
        String token = authorizationHeader.substring(7);// Assuming the scheme is "Bearer "
        if (tokenService.validateToken(token)) {
            User userAuthorized = tokenService.getUserByToken(token);
            boolean success = carService.deleteCarByPlateAndUser(car.getPlate(), userAuthorized);
            if (success) {
                return ResponseEntity.ok().body("Car deleted successfully");
            } else {
                return ResponseEntity.badRequest().body("Failed to delete car");
            }
        } else {
            return ResponseEntity.badRequest().body("Authentication token invalid. Protected resource could not be accessed");
        }
    }

    @Getter @Setter
    @AllArgsConstructor
    public static class CarDetails {
        private String plate;
        private int capacity;
        private String type;
    }
}
