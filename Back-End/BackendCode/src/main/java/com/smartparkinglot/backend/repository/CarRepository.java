package com.smartparkinglot.backend.repository;

import com.smartparkinglot.backend.entity.Car;
import com.smartparkinglot.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {

    List<Car> getCarsByUser(User user);
    @Query(value = "SELECT plate FROM cars WHERE id = :id", nativeQuery = true)
    Car getCarById(Long id);
}
