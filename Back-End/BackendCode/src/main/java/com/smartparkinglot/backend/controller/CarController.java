package com.smartparkinglot.backend.controller;

import com.smartparkinglot.backend.entity.Car;
import com.smartparkinglot.backend.entity.ParkingLot;
import com.smartparkinglot.backend.service.CarService;
import org.intellij.lang.annotations.JdkConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/car")
public class CarController {
    private final CarService carService;

    @Autowired
    public CarController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping
    public List<Car> getCars(){
        return carService.getAllCars();
    }

    @PostMapping
    public void registerNewCar(@RequestBody Car car) {
        carService.addNewCar(car);
    }
}
