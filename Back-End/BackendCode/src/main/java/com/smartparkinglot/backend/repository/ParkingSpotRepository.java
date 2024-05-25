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
public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, Long> {
    public boolean existsById(Long id);
    public Optional<List<ParkingSpot>> findByParkingLot(ParkingLot parkingLot);
    public Optional<ParkingSpot> getParkingSpotById(Long id);

    @Query(value = "SELECT * FROM GetAvailableParkingSpots(:start_time, :stop_time)", nativeQuery = true)
    Optional<List<ParkingSpot>> findAvailableParkingSpots(@Param("start_time") Timestamp start_time, @Param("stop_time") Timestamp stop_time);

    @Query(value = "SELECT checkparkingspotavailability(:spot_id, :start_time, :stop_time)", nativeQuery = true)
    public boolean checkParkingSpotAvailability(Long spot_id, Timestamp start_time, Timestamp stop_time);

    @Query(value = "SELECT calculatereservationcost(:start_time, :stop_time, :spot_id)", nativeQuery = true)
    public Integer calculateReservationCost(Timestamp start_time, Timestamp stop_time, Long spot_id);

    Optional<List<ParkingSpot>> getParkingSpotsByParkingLot(ParkingLot parkingLot);
}
