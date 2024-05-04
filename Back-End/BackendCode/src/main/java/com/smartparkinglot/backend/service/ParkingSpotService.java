package com.smartparkinglot.backend.service;

import com.smartparkinglot.backend.entity.ParkingLot;
import com.smartparkinglot.backend.entity.ParkingSpot;
import com.smartparkinglot.backend.repository.ParkingSpotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public void addNewParkingSpot(ParkingSpot parkingSpot) {
        if(parkingSpotRepository.existsById(parkingSpot.getId())){
            throw new IllegalStateException("Parking spot with ID " + parkingSpot.getId() + " already exists");
        }
        parkingSpotRepository.save(parkingSpot);
    }

    public List<ParkingSpot> findByParkingLot(ParkingLot parkingLot) {
        return parkingSpotRepository.findByParkingLot(parkingLot).orElse(null);
    }
}
