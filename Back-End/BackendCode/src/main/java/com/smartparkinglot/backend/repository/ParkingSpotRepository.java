package com.smartparkinglot.backend.repository;

import com.smartparkinglot.backend.entity.ParkingLot;
import com.smartparkinglot.backend.entity.ParkingSpot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, String> {
    public boolean existsById(Long id);
    public Optional<List<ParkingSpot>> findByParkingLot(ParkingLot parkingLot);

    @Query(value = "SELECT * FROM GetAvailableParkingSpots(:start_time, :stop_time)", nativeQuery = true)
    Optional<List<ParkingSpot>> findAvailableParkingSpots(@Param("start_time") Timestamp start_time, @Param("stop_time") Timestamp stop_time);

}
