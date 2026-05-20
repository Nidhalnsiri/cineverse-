package com.cineverse.backend.service;

import com.cineverse.backend.model.User;
import com.cineverse.backend.model.UserPaymentCard;
import com.cineverse.backend.payload.request.PaymentCardRequest;
import com.cineverse.backend.payload.response.SavedCardResponse;
import com.cineverse.backend.repository.UserPaymentCardRepository;
import com.cineverse.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.HexFormat;

@Service
public class PaymentCardService {

    @Autowired
    private UserPaymentCardRepository cardRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public SavedCardResponse getSavedCard(Long userId) {
        return cardRepository.findByUser_Id(userId)
                .map(card -> new SavedCardResponse(
                        true,
                        card.getCardType(),
                        card.getCardHolder(),
                        card.getCardLastFour(),
                        card.getExpiry(),
                        "Utilisez votre carte enregistrée se terminant par " + card.getCardLastFour()
                ))
                .orElseGet(() -> new SavedCardResponse(
                        false, null, null, null, null,
                        "Premier paiement pour ce compte : entrez n'importe quel numéro à 16 chiffres — il sera enregistré pour vos prochaines réservations."
                ));
    }

    @Transactional
    public void validateAndRegister(Long userId, PaymentCardRequest payment) {
        if (payment == null) {
            throw new RuntimeException("Informations de paiement requises");
        }

        String rawNumber = normalizeCardNumber(payment.getCardNumber());
        validateCardFormat(payment, rawNumber);

        String hash = hashCardNumber(rawNumber);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        var existing = cardRepository.findByUser_Id(userId);

        if (existing.isEmpty()) {
            UserPaymentCard card = new UserPaymentCard();
            card.setUser(user);
            card.setCardType(payment.getCardType());
            card.setCardHolder(payment.getCardHolder().trim());
            card.setCardNumberHash(hash);
            card.setCardLastFour(rawNumber.substring(rawNumber.length() - 4));
            card.setExpiry(payment.getExpiry());
            card.setCreatedAt(LocalDateTime.now());
            cardRepository.save(card);
            return;
        }

        UserPaymentCard saved = existing.get();
        if (!saved.getCardNumberHash().equals(hash)) {
            throw new RuntimeException(
                    "Pour ce compte, vous devez utiliser le même numéro de carte que lors de votre premier paiement (•••• "
                            + saved.getCardLastFour() + ")."
            );
        }
    }

    private void validateCardFormat(PaymentCardRequest payment, String rawNumber) {
        if (payment.getCardHolder() == null || payment.getCardHolder().trim().length() < 3) {
            throw new RuntimeException("Nom du titulaire invalide");
        }
        if (rawNumber.length() != 16) {
            throw new RuntimeException("Le numéro de carte doit contenir exactement 16 chiffres");
        }
        if (payment.getExpiry() == null || !payment.getExpiry().matches("\\d{2}/\\d{2}")) {
            throw new RuntimeException("Date d'expiration invalide (MM/AA)");
        }
        if (payment.getCvv() == null || payment.getCvv().length() < 3) {
            throw new RuntimeException("CVV invalide");
        }
    }

    private String normalizeCardNumber(String number) {
        if (number == null) return "";
        return number.replaceAll("\\D", "");
    }

    private String hashCardNumber(String digits) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(digits.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("Erreur de traitement du paiement");
        }
    }

}
