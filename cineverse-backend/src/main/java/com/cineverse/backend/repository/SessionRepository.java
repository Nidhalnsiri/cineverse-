package com.cineverse.backend.repository;
import com.cineverse.backend.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByMovieId(Long movieId);

    @Query("""
            SELECT s FROM Session s
            JOIN FETCH s.movie
            JOIN FETCH s.room r
            JOIN FETCH r.cinema
            WHERE s.id = :id
            """)
    Optional<Session> findByIdWithDetails(Long id);
}
