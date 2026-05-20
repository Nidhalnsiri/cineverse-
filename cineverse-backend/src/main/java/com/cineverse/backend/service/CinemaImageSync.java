package com.cineverse.backend.service;

import com.cineverse.backend.model.Cinema;
import com.cineverse.backend.repository.CinemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

@Component
@Order(4)
public class CinemaImageSync implements CommandLineRunner {

    /** URLs fiables — picsum pour les cinémas dont Unsplash échoue */
    private static final Map<String, String> CINEMA_IMAGES = new LinkedHashMap<>();

    static {
        CINEMA_IMAGES.put("Pathé Tunis City",
                "https://picsum.photos/id/312/900/500");
        CINEMA_IMAGES.put("Pathé Les Berges du Lac",
                "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80");
        CINEMA_IMAGES.put("Azur City La Marsa",
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80");
        CINEMA_IMAGES.put("Le Palace Sousse",
                "https://picsum.photos/id/174/900/500");
        CINEMA_IMAGES.put("Pathé Sfax",
                "https://picsum.photos/id/433/900/500");
        CINEMA_IMAGES.put("Colisée Nabeul",
                "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80");
        CINEMA_IMAGES.put("Cinéplex Hammamet",
                "https://picsum.photos/id/1003/900/500");
    }

    @Autowired
    private CinemaRepository cinemaRepository;

    @Override
    public void run(String... args) {
        for (Cinema cinema : cinemaRepository.findAll()) {
            String url = CINEMA_IMAGES.get(cinema.getName());
            if (url != null) {
                cinema.setImageUrl(url);
                cinemaRepository.save(cinema);
            }
        }
    }
}
