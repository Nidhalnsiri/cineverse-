package com.cineverse.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_payment_cards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserPaymentCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String cardType;
    private String cardHolder;
    /** Empreinte SHA-256 du numéro (16 chiffres) — pas le numéro en clair */
    @Column(name = "card_number_hash", nullable = false)
    private String cardNumberHash;

    @Column(name = "card_last_four", nullable = false)
    private String cardLastFour;

    private String expiry;

    private LocalDateTime createdAt;
}
