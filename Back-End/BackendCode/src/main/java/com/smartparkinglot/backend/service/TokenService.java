package com.smartparkinglot.backend.service;

import com.smartparkinglot.backend.entity.Reservation;
import com.smartparkinglot.backend.entity.Token;
import com.smartparkinglot.backend.repository.TokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TokenService {
    private final TokenRepository tokenRepository;

    @Autowired
    public TokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    public List<Token> getAllTokens() {
        return tokenRepository.findAll();
    }

    public void addNewToken(Token token) {
        if (tokenRepository.existsById(token.getToken())) {
            throw new IllegalStateException("Token " + token.getToken() + " already exists");
        }
        tokenRepository.save(token);
    }
}
