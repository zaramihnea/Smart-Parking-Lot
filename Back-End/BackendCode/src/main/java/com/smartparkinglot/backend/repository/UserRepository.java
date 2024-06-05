package com.smartparkinglot.backend.repository;

import com.smartparkinglot.backend.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
   boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    @Query(value = "SELECT TryLogin(:email, :password)", nativeQuery = true)
    boolean tryLogin(String email, String password);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.password = :password WHERE u.email = :email")
    void updatePassword(@Param("email") String email, @Param("password") String password);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.stripeAccountId = :stripeAccountId WHERE u.email = :email")
    void updateStripeAccountId(@Param("email") String email, @Param("stripeAccountId") String stripeAccountId);


    @Query(value = "SELECT IsBanned(:email)", nativeQuery = true)
    boolean isBanned(String email);

    @Modifying
    @Transactional
    @Query("DELETE FROM User u WHERE u.email = :email")
    void deleteFromUsersTable(@Param("email") String email);

    @Query(value = "SELECT GetUsersFavoriteParkingLot(:email)", nativeQuery = true)
    Long getFavoriteLot(@Param("email") String email);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO banned_users (email) VALUES (:email)", nativeQuery = true)
    void addToBannedUsers(@Param("email") String email);

}
