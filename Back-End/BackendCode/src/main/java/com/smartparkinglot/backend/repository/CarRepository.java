package com.smartparkinglot.backend.repository;

import com.smartparkinglot.backend.entity.Car;
import com.smartparkinglot.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

public interface CarRepository extends JpaRepository<Car, String> {

    List<Car> getCarsByUser(User user);
}
