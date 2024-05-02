package com.smartparkinglot.backend.controller;

import com.smartparkinglot.backend.entity.Reservation;
import com.smartparkinglot.backend.entity.Token;
import com.smartparkinglot.backend.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/token")
public class TokenController {
    private final TokenService tokenService;

    @Autowired
    public TokenController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

}
