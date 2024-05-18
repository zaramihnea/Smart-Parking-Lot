package com.smartparkinglot.backend.tasks;

import com.smartparkinglot.backend.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;

@Component
public class ReservationCleanupTask {

    private final ReservationRepository reservationRepository;

    @Autowired
    public ReservationCleanupTask(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @Scheduled(cron = "0 0 0 * * ?") // Every day at midnight
    @Transactional
    @Async
    public void cleanUpOldReservations() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minus(30, ChronoUnit.DAYS);
        Timestamp cutoffDate = Timestamp.valueOf(thirtyDaysAgo);
        reservationRepository.deleteCancelledReservationsOlderThan(cutoffDate);
        System.out.println("Deleted reservations older than 30 days");
    }
}
