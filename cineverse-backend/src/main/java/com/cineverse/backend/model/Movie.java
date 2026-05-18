package com.cineverse.backend.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "movies")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Movie {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    private Integer duration; // in minutes
    private String genre;
    private String director;
    private String actors;
    private LocalDate releaseDate;
    private Integer minAge;
    private String posterUrl;
    private String trailerUrl;
    private Double imdbRating;
}
