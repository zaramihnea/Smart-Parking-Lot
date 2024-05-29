package com.smartparkinglot.backend.repository;

import com.smartparkinglot.backend.entity.Token;
import com.smartparkinglot.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, String> {
    Optional<Token> findByToken(String token);

    List<Token> findByUser(User user);

    @Modifying
    @Query("DELETE FROM Token t WHERE t.expirationDate <= :timestamp")  // Use the entity name "Token"
    void deleteAllExpiredSince(Timestamp timestamp);
}