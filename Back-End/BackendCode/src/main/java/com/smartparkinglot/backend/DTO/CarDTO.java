package com.smartparkinglot.backend.DTO;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class CarDTO {
    private Long id;
    private String plate;
    private int capacity;
    private String type;

}
