package com.cineverse.backend.service;

import com.cineverse.backend.model.Reservation;
import com.cineverse.backend.model.Seat;
import com.cineverse.backend.model.Session;
import com.cineverse.backend.model.Ticket;
import com.cineverse.backend.model.User;
import com.cineverse.backend.payload.response.ReservationResponse;
import com.cineverse.backend.repository.ReservationRepository;
import com.cineverse.backend.repository.SeatRepository;
import com.cineverse.backend.repository.SessionRepository;
import com.cineverse.backend.repository.TicketRepository;
import com.cineverse.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReservationService {
    @Autowired private ReservationRepository reservationRepository;
    @Autowired private SeatRepository seatRepository;
    @Autowired private SessionRepository sessionRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private TicketRepository ticketRepository;

    public List<Long> getOccupiedSeatIds(Long sessionId) {
        return ticketRepository.findOccupiedSeatIdsBySessionId(sessionId);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getUserReservations(Long userId) {
        return reservationRepository.findByUserIdOrderByReservationDateDesc(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReservationResponse createReservation(Long userId, Long sessionId, List<Long> seatIds) {
        if (seatIds == null || seatIds.isEmpty()) {
            throw new RuntimeException("Sélectionnez au moins un siège");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Séance introuvable"));

        Set<Long> occupied = new HashSet<>(ticketRepository.findOccupiedSeatIdsBySessionId(sessionId));
        double basePrice = session.getPrice() != null ? session.getPrice() : 12.5;
        double totalAmount = 0;

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setSession(session);
        reservation.setReservationDate(LocalDateTime.now());
        reservation.setStatus("CONFIRMED");
        reservation = reservationRepository.save(reservation);

        for (Long seatId : seatIds) {
            if (occupied.contains(seatId)) {
                throw new RuntimeException("Le siège est déjà réservé pour cette séance");
            }
            Seat seat = seatRepository.findById(seatId)
                    .orElseThrow(() -> new RuntimeException("Siège introuvable"));
            if (!seat.getRoom().getId().equals(session.getRoom().getId())) {
                throw new RuntimeException("Ce siège n'appartient pas à la salle de la séance");
            }
            totalAmount += "VIP".equals(seat.getType()) ? basePrice + 3 : basePrice;

            Ticket ticket = new Ticket();
            ticket.setReservation(reservation);
            ticket.setSeat(seat);
            ticket.setQrCode("CV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            ticketRepository.save(ticket);
            occupied.add(seatId);
        }

        reservation.setTotalPrice(totalAmount);
        reservation = reservationRepository.save(reservation);
        return toResponse(reservationRepository.findByIdWithDetails(reservation.getId()).orElse(reservation));
    }

    private ReservationResponse toResponse(Reservation reservation) {
        List<String> labels = ticketRepository.findByReservationIdWithSeat(reservation.getId()).stream()
                .map(t -> t.getSeat().getRowNum() + t.getSeat().getColNum())
                .sorted()
                .collect(Collectors.toList());

        Session session = reservation.getSession();
        String movieTitle = session.getMovie() != null ? session.getMovie().getTitle() : "";
        String roomName = session.getRoom() != null ? session.getRoom().getName() : "";
        String date = session.getDate() != null ? session.getDate().toString() : "";
        String time = session.getTime() != null ? session.getTime().toString().substring(0, 5) : "";

        String cinemaName = "";
        String cinemaCity = "";
        String cinemaAddress = "";
        if (session.getRoom() != null && session.getRoom().getCinema() != null) {
            var cinema = session.getRoom().getCinema();
            cinemaName = cinema.getName() != null ? cinema.getName() : "";
            cinemaCity = cinema.getCity() != null ? cinema.getCity() : "";
            cinemaAddress = cinema.getAddress() != null ? cinema.getAddress() : "";
        }

        return new ReservationResponse(
                reservation.getId(),
                reservation.getStatus(),
                reservation.getReservationDate(),
                reservation.getTotalPrice(),
                movieTitle,
                date,
                time,
                cinemaName,
                cinemaCity,
                cinemaAddress,
                roomName,
                labels
        );
    }
}
