package com.smartparkinglot.backend.controller;

import com.smartparkinglot.backend.entity.User;
import com.smartparkinglot.backend.service.TokenService;
import com.smartparkinglot.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/protected-resource")
public class JwtExampleController {
    private final TokenService tokenService;
    @Autowired
    public JwtExampleController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @GetMapping
    public String getProtectedResource(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);// Assuming the scheme is "Bearer "
        if(tokenService.validateToken(token)) {
            User userAuthorized = tokenService.getUserByToken(token);
            System.out.println("User " + userAuthorized + " accessed his protected resource, authorized by token " + token);

            return "User " + userAuthorized + " accessed his protected resource, authorized by token " + token;
        }
        else {
            return "Authentication token invalid. Protected resource could not be acessed";
        }
    }
}
