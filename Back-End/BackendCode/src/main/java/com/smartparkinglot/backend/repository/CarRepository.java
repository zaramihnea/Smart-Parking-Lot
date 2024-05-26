package com.smartparkinglot.backend.repository;

import com.smartparkinglot.backend.entity.Car;
import com.smartparkinglot.backend.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {

    List<Car> getCarsByUser(User user);
    @Query(value = "SELECT * FROM cars WHERE id = :id", nativeQuery = true)
    Car getCarById(Long id);


    boolean existsByPlate(String plate);

    Car getByPlate(String plate);

    @Modifying
    @Transactional
    @Query("DELETE FROM Car c WHERE c.plate = :plate AND c.user = :user")
    int deleteByPlateAndUser(@Param("plate") String plate, @Param("user") User user);


}
