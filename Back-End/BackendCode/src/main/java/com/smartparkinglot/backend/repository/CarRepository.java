package com.smartparkinglot.backend.repository;

import com.smartparkinglot.backend.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarRepository extends JpaRepository<Car, String> {
}
