package com.smartparkinglot.backend.repository;

import com.smartparkinglot.backend.entity.ParkingLot;
import com.smartparkinglot.backend.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingLotRepository extends JpaRepository<ParkingLot, Long> {

   // Function 'earth_distance' calculates the distance in meters between two points
   // given their coordinates
   @Query("SELECT p FROM ParkingLot p WHERE function('earth_distance', function('ll_to_earth', p.latitude, p.longitude), function('ll_to_earth', :lat, :lon)) < :radius")
   List<ParkingLot> findWithinRadius(@Param("lat") BigDecimal latitude, @Param("lon") BigDecimal longitude, @Param("radius") Long radius);

   @Query("SELECT p FROM ParkingLot p WHERE p.user = :admin")
   List<ParkingLot> findAllByAdminEmail(@Param("admin") User admin);

   @Modifying
   @Transactional
   @Query("DELETE FROM ParkingLot p WHERE p.id = :id")
   void deleteParkingLot(@Param("id") Long id);

   @Modifying
   @Transactional
   @Query("UPDATE ParkingLot p SET p.price = :price WHERE p.id = :id")
   void updatePrice(@Param("id") Long id, @Param("price") Float price);


    boolean existsByLatitudeAndLongitude(BigDecimal bigDecimal, BigDecimal bigDecimal1);
}
