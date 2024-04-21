package com.smartparkinglot.backend.controller;

import com.smartparkinglot.backend.entity.Plate;
import com.smartparkinglot.backend.service.PlateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/plate")
public class PlateController {

    private final PlateService plateService;

    @Autowired
    public PlateController(PlateService plateService) {
        this.plateService = plateService;
    }

    @GetMapping
    public List<Plate> getPlates(){
        return plateService.getAllPlates();
    }

    @PostMapping
    public void registerNewPlate(@RequestBody Plate plate) {
        plateService.addNewPlate(plate);
    }
}
