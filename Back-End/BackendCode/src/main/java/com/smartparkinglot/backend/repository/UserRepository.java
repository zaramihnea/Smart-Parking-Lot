package com.smartparkinglot.backend.repository;

import com.smartparkinglot.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    User findByUsername(String username);

    @Query(value = "SELECT TryLogin(:username, :password)", nativeQuery = true)
    boolean tryLogin(String username, String password);
}
