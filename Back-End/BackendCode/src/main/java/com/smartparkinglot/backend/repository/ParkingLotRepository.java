package com.smartparkinglot.backend.repository;

import com.smartparkinglot.backend.entity.ParkingLot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParkingLotRepository extends JpaRepository<ParkingLot, String> {
   /* @Query("select p from ParkingLot p where p.id=?1")
    Optional<ParkingLot> findParkingLotById(String id);*/
}
