package com.cineverse.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cinemas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Cinema {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String brand;
    private String city;
    private String address;
    private Double latitude;
    private Double longitude;
    private String imageUrl;

    @OneToMany(mappedBy = "cinema", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("cinema")
    private List<Room> rooms = new ArrayList<>();
}
