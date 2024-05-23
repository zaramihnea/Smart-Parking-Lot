package com.smartparkinglot.backend.service;

import com.smartparkinglot.backend.entity.ParkingLot;
import com.smartparkinglot.backend.entity.ParkingSpot;
import com.smartparkinglot.backend.repository.ParkingSpotRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.sql.Timestamp;
import java.util.List;

@Service
public class ParkingSpotService {
    private final ParkingSpotRepository parkingSpotRepository;

    @Autowired
    public ParkingSpotService(ParkingSpotRepository parkingSpotRepository) {
        this.parkingSpotRepository = parkingSpotRepository;
    }

    public List<ParkingSpot> getAllParkingSpots() {
        return parkingSpotRepository.findAll();
    }

    @Transactional
    public void addNewParkingSpot(ParkingSpot parkingSpot) {
        parkingSpotRepository.save(parkingSpot);
    }

    public List<ParkingSpot> findByParkingLot(ParkingLot parkingLot) {
        return parkingSpotRepository.findByParkingLot(parkingLot).orElse(null);
    }

    public List<ParkingSpot> findAvailableParkingSpots(Timestamp start_time, Timestamp stop_time) {
        return parkingSpotRepository.findAvailableParkingSpots(start_time, stop_time).orElse(null);
    }

    public boolean checkParkingSpotAvailability(Long spot_id, Timestamp start_time, Timestamp stop_time) {
        return parkingSpotRepository.checkParkingSpotAvailability(spot_id, start_time, stop_time);
    }

    public int calculateReservationCost(Timestamp start_time, Timestamp stop_time, Long spot_id) {
        Integer cost = parkingSpotRepository.calculateReservationCost(start_time, stop_time, spot_id);
        return (cost != null) ? cost : 0; // Default to 0 if null
    }


    public ParkingSpot getById(Long id) {
        return parkingSpotRepository.getParkingSpotById(id).orElse(null);
    }

    public void updateParkingSpot(ParkingSpot parkingSpot) {
        parkingSpotRepository.save(parkingSpot);
    }
}
