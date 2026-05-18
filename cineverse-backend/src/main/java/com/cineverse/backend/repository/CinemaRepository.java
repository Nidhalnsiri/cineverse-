package com.cineverse.backend.repository;

import com.cineverse.backend.model.Cinema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CinemaRepository extends JpaRepository<Cinema, Long> {

    @Query("SELECT DISTINCT c FROM Cinema c LEFT JOIN FETCH c.rooms ORDER BY c.city, c.name")
    List<Cinema> findAllWithRooms();

    boolean existsByCity(String city);
}
