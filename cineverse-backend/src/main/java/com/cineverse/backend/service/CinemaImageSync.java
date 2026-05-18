package com.cineverse.backend.service;

import com.cineverse.backend.model.Cinema;
import com.cineverse.backend.repository.CinemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Order(4)
public class CinemaImageSync implements CommandLineRunner {

    private static final String U = "https://images.unsplash.com/photo-%s?auto=format&fit=crop&w=800&q=80";

    private static final Map<String, String> CINEMA_IMAGES = Map.of(
            "Pathé Tunis City", String.format(U, "1574267432644-f610f5c0a3b0"),
            "Pathé Les Berges du Lac", String.format(U, "1517604931442-7e0c8ed2963c"),
            "Azur City La Marsa", String.format(U, "1489599849927-2ee91cede3ba"),
            "Le Palace Sousse", String.format(U, "1536440136628-849c177e76a1"),
            "Pathé Sfax", String.format(U, "1440404653325-ab127d49abc1"),
            "Colisée Nabeul", String.format(U, "1524985063818-6c64af0d9570"),
            "Cinéplex Hammamet", String.format(U, "1505683714384-49e9f6f8cd3b")
    );

    @Autowired
    private CinemaRepository cinemaRepository;

    @Override
    public void run(String... args) {
        for (Cinema cinema : cinemaRepository.findAll()) {
            String url = CINEMA_IMAGES.get(cinema.getName());
            if (url != null && !url.equals(cinema.getImageUrl())) {
                cinema.setImageUrl(url);
                cinemaRepository.save(cinema);
            }
        }
    }
}
