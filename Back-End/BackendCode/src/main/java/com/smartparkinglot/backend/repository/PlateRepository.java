package com.smartparkinglot.backend.repository;

import com.smartparkinglot.backend.entity.Plate;
import com.smartparkinglot.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlateRepository extends JpaRepository<Plate, Long> {
    boolean existsByPlate(String plate);
}
