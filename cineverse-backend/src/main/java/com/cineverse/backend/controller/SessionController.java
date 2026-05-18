package com.cineverse.backend.controller;

import com.cineverse.backend.model.Session;
import com.cineverse.backend.repository.SessionRepository;
import com.cineverse.backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    @Autowired
    SessionRepository sessionRepository;

    @Autowired
    ReservationService reservationService;

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Session>> getSessionsByMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(sessionRepository.findByMovieId(movieId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Session> getSessionById(@PathVariable Long id) {
        return sessionRepository.findByIdWithDetails(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/occupied-seats")
    public ResponseEntity<List<Long>> getOccupiedSeats(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getOccupiedSeatIds(id));
    }
}
