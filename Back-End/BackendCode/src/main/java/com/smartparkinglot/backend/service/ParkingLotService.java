package com.smartparkinglot.backend.service;

import com.smartparkinglot.backend.entity.ParkingLot;
import com.smartparkinglot.backend.repository.ParkingLotRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ParkingLotService {
    private final ParkingLotRepository parkingLotRepository;

    @Autowired
    public ParkingLotService(ParkingLotRepository parkingLotRepository) {
        this.parkingLotRepository = parkingLotRepository;
    }

    public List<ParkingLot> getAllParkingLots() {
        return parkingLotRepository.findAll();
    }

    public void addNewParkingLot(ParkingLot parkingLot) {
        if (parkingLotRepository.existsById(parkingLot.getId())) {
            throw new IllegalStateException("Parking lot with ID " + parkingLot.getId() + " already exists");
        }
        parkingLotRepository.save(parkingLot);
    }

    public void deleteStudent(String parkingLotId) {
        if(!parkingLotRepository.existsById(parkingLotId)){
            throw new IllegalStateException("Parking lot id " + parkingLotId + " doesn't exist");
        }
        parkingLotRepository.deleteById(parkingLotId);
    }

    // Transactional <=> no need of verification queries
    @Transactional
    public void updateParkingLot(String parkingLotId, Long nrSpots, BigDecimal latitude, BigDecimal longitude){
        ParkingLot parkingLot = parkingLotRepository.findById(parkingLotId)
                .orElseThrow(() -> new IllegalStateException("Parking lot id " + parkingLotId + " doesn't exist in parking_lots"));
        if(nrSpots != null && !nrSpots.equals(parkingLot.getNrSpots())){
            parkingLot.setNrSpots(nrSpots);
        }
        if(latitude != null && !latitude.equals(parkingLot.getLatitude())){
            parkingLot.setLatitude(latitude);
        }
        if(longitude != null && !longitude.equals(parkingLot.getLongitude())){
            parkingLot.setLongitude(longitude);
        }
    }
}
