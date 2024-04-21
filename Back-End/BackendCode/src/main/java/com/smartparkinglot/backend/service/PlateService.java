package com.smartparkinglot.backend.service;
import com.smartparkinglot.backend.entity.Plate;
import com.smartparkinglot.backend.repository.PlateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlateService {
    private final PlateRepository plateRepository;

    @Autowired
    public PlateService(PlateRepository plateRepository) {
        this.plateRepository = plateRepository;
    }

    public List<Plate> getAllPlates(){
        return plateRepository.findAll();
    }

    public void addNewPlate(Plate plate) {
        boolean plateExists = plateRepository.existsByPlate(plate.getPlate());

        if (plateExists) {
            throw new IllegalStateException("The plate already exists!");
        }

        plateRepository.save(plate);
    }

}
