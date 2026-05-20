package com.cineverse.backend.repository;

import com.cineverse.backend.model.UserPaymentCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPaymentCardRepository extends JpaRepository<UserPaymentCard, Long> {
    Optional<UserPaymentCard> findByUser_Id(Long userId);
}
