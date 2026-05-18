package com.cineverse.backend.controller;

import com.cineverse.backend.payload.request.ReservationRequest;
import com.cineverse.backend.payload.response.ReservationResponse;
import com.cineverse.backend.security.services.UserDetailsImpl;
import com.cineverse.backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    @Autowired ReservationService reservationService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ReservationResponse> createReservation(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @RequestBody ReservationRequest request) {
        Long userId = principal != null ? principal.getId() : request.getUserId();
        ReservationResponse reservation = reservationService.createReservation(
                userId, request.getSessionId(), request.getSeatIds());
        return ResponseEntity.ok(reservation);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ReservationResponse>> myReservations(
            @AuthenticationPrincipal UserDetailsImpl principal) {
        return ResponseEntity.ok(reservationService.getUserReservations(principal.getId()));
    }
}
