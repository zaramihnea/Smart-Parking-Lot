package com.smartparkinglot.backend.repository;

import com.smartparkinglot.backend.entity.ParkingSpot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, String> {
    public boolean existsById(Long id);
}
