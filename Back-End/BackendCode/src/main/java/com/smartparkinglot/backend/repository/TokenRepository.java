package com.smartparkinglot.backend.repository;

import com.smartparkinglot.backend.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenRepository extends JpaRepository<Token, String> {
}
