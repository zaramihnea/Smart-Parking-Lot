package com.smartparkinglot.backend.tasks;
import com.smartparkinglot.backend.repository.TokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.sql.Timestamp;

@Component
public class TokenCleanupTask {
    private TokenRepository tokenRepository;

    @Autowired
    public TokenCleanupTask(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    // Scheduled method to clean up expired tokens
    @Scheduled(fixedRate = 3600000) // every hour
    @Transactional
    public void cleanUpExpiredTokens() {
        Timestamp now = new Timestamp(System.currentTimeMillis());  // Use Timestamp
        tokenRepository.deleteAllExpiredSince(now);
    }
}
