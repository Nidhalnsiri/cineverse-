package com.cineverse.backend.controller;

import com.cineverse.backend.payload.response.SavedCardResponse;
import com.cineverse.backend.security.services.UserDetailsImpl;
import com.cineverse.backend.service.PaymentCardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentCardService paymentCardService;

    @GetMapping("/card")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<SavedCardResponse> getMyCard(@AuthenticationPrincipal UserDetailsImpl principal) {
        return ResponseEntity.ok(paymentCardService.getSavedCard(principal.getId()));
    }
}
