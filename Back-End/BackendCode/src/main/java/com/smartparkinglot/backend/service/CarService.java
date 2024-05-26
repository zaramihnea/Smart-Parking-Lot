package com.smartparkinglot.backend.service;

import com.smartparkinglot.backend.entity.Car;
import com.smartparkinglot.backend.entity.Card;
import com.smartparkinglot.backend.entity.User;
import com.smartparkinglot.backend.repository.CarRepository;
import com.smartparkinglot.backend.repository.CardRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarService {
    private final CarRepository carRepository;

    @Autowired
    public CarService( CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    @Transactional
    public void addNewCar(Car car) {
        carRepository.save(car);
    }
    public List<Car> getCarsByUser(User user) {
        return carRepository.getCarsByUser(user);
    }

    public String getPlateById(Long id){
        Car car = carRepository.getCarById(id);
        return car.getPlate();
    }

    public boolean existsByPlate(String plate) {
        return carRepository.existsByPlate(plate);
    }

    public Car getByPlate(String plate) {
        return carRepository.getByPlate(plate);
    }
}
