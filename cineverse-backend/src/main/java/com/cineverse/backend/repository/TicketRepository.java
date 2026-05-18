package com.cineverse.backend.repository;

import com.cineverse.backend.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query("""
            SELECT t.seat.id FROM Ticket t
            WHERE t.reservation.session.id = :sessionId
            AND t.reservation.status = 'CONFIRMED'
            """)
    List<Long> findOccupiedSeatIdsBySessionId(Long sessionId);

    @Query("""
            SELECT t FROM Ticket t
            JOIN FETCH t.seat
            WHERE t.reservation.id = :reservationId
            """)
    List<Ticket> findByReservationIdWithSeat(Long reservationId);
}
