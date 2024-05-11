package com.smartparkinglot.backend.repository;

import com.smartparkinglot.backend.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, String> {
    @Query(value = "SELECT * FROM GetUsersActiveReservations(:userEmail)", nativeQuery = true)
    public Optional<List<Reservation>> getOwnActiveReservations(@Param("userEmail") String userEmail);

    @Query(value = "SELECT * FROM GetUsersReservations(:userEmail)", nativeQuery = true)
    public Optional<List<Reservation>> getUsersReservations(@Param("userEmail") String userEmail);
}
