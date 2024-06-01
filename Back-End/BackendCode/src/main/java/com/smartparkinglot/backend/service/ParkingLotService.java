package com.smartparkinglot.backend.service;

import com.smartparkinglot.backend.entity.ParkingLot;
import com.smartparkinglot.backend.entity.User;
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
    public List<ParkingLot> getParkingLotsWithinRadius(BigDecimal latitude, BigDecimal longitude, Long radius) {
        return parkingLotRepository.findWithinRadius(latitude, longitude, radius);
    }

    public ParkingLot getParkingLotById(Long id){
        if(parkingLotRepository.findById(id).isPresent())
            return parkingLotRepository.findById(id).get();
        else return null;
    }

    public boolean existsById(Long id) {
        return parkingLotRepository.existsById(id);
    }

    public List<ParkingLot> getAllParkingLots() {
        return parkingLotRepository.findAll();
    }

    @Transactional
    public void save(ParkingLot parkingLot) {
        parkingLotRepository.save(parkingLot);
    }

    @Transactional
    public void updateLot(ParkingLot parkingLot){
        parkingLotRepository.updatePrice(parkingLot.getId(), parkingLot.getPrice());
        parkingLotRepository.updateName(parkingLot.getId(), parkingLot.getName());
        parkingLotRepository.updateNrSpots(parkingLot.getId(), parkingLot.getNrSpots());
    }

    // Transactional <=> no need of verification queries
    @Transactional
    public void updateParkingLot(Long parkingLotId, int nrSpots, BigDecimal latitude, BigDecimal longitude){
        ParkingLot parkingLot = parkingLotRepository.findById(parkingLotId)
                .orElseThrow(() -> new IllegalStateException("Parking lot id " + parkingLotId + " doesn't exist in parking_lots"));
        if( nrSpots != parkingLot.getNrSpots()){
            parkingLot.setNrSpots(nrSpots);
        }
        if(latitude != null && !latitude.equals(parkingLot.getLatitude())){
            parkingLot.setLatitude(latitude);
        }
        if(longitude != null && !longitude.equals(parkingLot.getLongitude())){
            parkingLot.setLongitude(longitude);
        }
    }

    @Transactional
    public void deleteParkingLot(ParkingLot parkingLot){
        parkingLotRepository.deleteParkingLot(parkingLot.getId());
    }

    @Transactional
    public void updatePrice(ParkingLot parkingLot, Float price){
        parkingLotRepository.updatePrice(parkingLot.getId(), price);
    }


    public List<ParkingLot> findAllByAdminEmail(User admin){
        return parkingLotRepository.findAllByAdminEmail(admin);
    }

}
