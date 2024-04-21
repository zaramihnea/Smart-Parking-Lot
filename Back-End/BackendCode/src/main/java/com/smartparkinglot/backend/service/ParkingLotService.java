package com.smartparkinglot.backend.service;

import com.smartparkinglot.backend.entity.ParkingLot;
import com.smartparkinglot.backend.entity.Plate;
import com.smartparkinglot.backend.repository.ParkingLotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
