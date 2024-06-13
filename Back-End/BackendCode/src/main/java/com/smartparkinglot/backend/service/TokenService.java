package com.smartparkinglot.backend.service;

import com.smartparkinglot.backend.entity.Reservation;
import com.smartparkinglot.backend.entity.Token;
import com.smartparkinglot.backend.entity.User;
import com.smartparkinglot.backend.repository.TokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;

import java.util.List;
import java.util.Optional;

@Service
public class TokenService {
    private final String secretKey = "5BxDlhCs3OIZ5S910xf1bpXK5RR9B7HqoMI+2zLsybE=";
    private final TokenRepository tokenRepository;

    @Autowired
    public TokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    public User getUserByToken(String token) {
        Optional<Token> tokenOptional = tokenRepository.findByToken(token);
        if(tokenOptional.isPresent()) {
            Token tokenFound = tokenOptional.get();
            return tokenFound.getUser();
        }
        return null;
    }
    public String generateToken(User user) {
        Optional<Token> existingTokenOptional = tokenRepository.findByUser(user).stream().findFirst();
        if(existingTokenOptional.isPresent()) {
            return existingTokenOptional.get().getToken();
        }

        Timestamp now = new Timestamp(System.currentTimeMillis());
        Timestamp expiryDate = new Timestamp(now.getTime() + 1000 * 60 * 60 * 10); // 10 hours validity

        String token = Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();

        Token jwtToken = new Token();
        jwtToken.setToken(token);
        jwtToken.setUser(user);
        jwtToken.setExpirationDate(expiryDate);
        tokenRepository.save(jwtToken);

        return token;
    }

    public String getTokenByUser(User user){
        List<Token> tokens = tokenRepository.findByUser(user);
        if(!tokens.isEmpty()) {
            Token tokenFound = tokens.get(0);
            return tokenFound.getToken();
        }
        return null;
    }

    @Transactional
    public Boolean validateToken(String token) {
        Optional<Token> jwtTokenOpt = tokenRepository.findByToken(token);
        Timestamp now = new Timestamp(System.currentTimeMillis());
        if (jwtTokenOpt.isPresent()) {
            Token jwtToken = jwtTokenOpt.get();
            if (jwtToken.getExpirationDate().before(new Date(now.getTime()))) {
                tokenRepository.delete(jwtToken); // Delete expired token
                return false;
            }
            return true;
        }
        return false;
    }

    public void deleteUserTokens(User userAuthorized) {
        tokenRepository.deleteUserTokens(userAuthorized.getEmail());
    }
}
