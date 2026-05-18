package com.cineverse.backend.controller;

import com.cineverse.backend.model.Seat;
import com.cineverse.backend.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/seats")
public class SeatController {

    @Autowired
    SeatRepository seatRepository;

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<Seat>> getSeatsByRoom(@PathVariable Long roomId) {
        return ResponseEntity.ok(seatRepository.findByRoomId(roomId));
    }
}
