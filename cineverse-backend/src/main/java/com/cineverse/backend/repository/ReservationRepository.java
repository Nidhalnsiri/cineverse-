package com.cineverse.backend.repository;
import com.cineverse.backend.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);

    @Query("""
            SELECT r FROM Reservation r
            JOIN FETCH r.session s
            JOIN FETCH s.movie
            JOIN FETCH s.room rm
            JOIN FETCH rm.cinema
            WHERE r.user.id = :userId
            ORDER BY r.reservationDate DESC
            """)
    List<Reservation> findByUserIdOrderByReservationDateDesc(Long userId);

    @Query("""
            SELECT r FROM Reservation r
            JOIN FETCH r.session s
            JOIN FETCH s.movie
            JOIN FETCH s.room rm
            JOIN FETCH rm.cinema
            WHERE r.id = :id
            """)
    Optional<Reservation> findByIdWithDetails(Long id);
}
