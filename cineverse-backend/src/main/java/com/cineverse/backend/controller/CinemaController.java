package com.cineverse.backend.controller;

import com.cineverse.backend.model.Cinema;
import com.cineverse.backend.repository.CinemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cinemas")
public class CinemaController {

    @Autowired
    CinemaRepository cinemaRepository;

    @GetMapping
    public ResponseEntity<List<Cinema>> getAll() {
        return ResponseEntity.ok(cinemaRepository.findAllWithRooms());
    }
}
