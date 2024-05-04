package com.smartparkinglot.backend.repository;

import com.smartparkinglot.backend.entity.ParkingLot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingLotRepository extends JpaRepository<ParkingLot, String> {

   // Function 'earth_distance' calculates the distance in meters between two points
   // given their coordinates
   @Query("SELECT p FROM ParkingLot p WHERE function('earth_distance', function('ll_to_earth', p.latitude, p.longitude), function('ll_to_earth', :lat, :lon)) < :radius")
   List<ParkingLot> findWithinRadius(@Param("lat") BigDecimal latitude, @Param("lon") BigDecimal longitude, @Param("radius") Long radius);

}
