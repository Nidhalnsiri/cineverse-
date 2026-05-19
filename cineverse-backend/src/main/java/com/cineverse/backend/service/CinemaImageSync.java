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

    /** Une image visuellement distincte par cinéma (extérieur, mer, vintage, plage, etc.) */
    private static final Map<String, String> CINEMA_IMAGES = new LinkedHashMap<>();

    static {
        CINEMA_IMAGES.put("Pathé Tunis City",
                "https://images.unsplash.com/photo-1598899134739-f2c5b08accd8?auto=format&fit=crop&w=900&q=80");
        CINEMA_IMAGES.put("Pathé Les Berges du Lac",
                "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80");
        CINEMA_IMAGES.put("Azur City La Marsa",
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80");
        CINEMA_IMAGES.put("Le Palace Sousse",
                "https://images.unsplash.com/photo-1507676180810-ef002b6856a1?auto=format&fit=crop&w=900&q=80");
        CINEMA_IMAGES.put("Pathé Sfax",
                "https://images.unsplash.com/photo-1522869635100-904f7a5fa963?auto=format&fit=crop&w=900&q=80");
        CINEMA_IMAGES.put("Colisée Nabeul",
                "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80");
        CINEMA_IMAGES.put("Cinéplex Hammamet",
                "https://images.unsplash.com/photo-1571004348644-fac41007e7f2?auto=format&fit=crop&w=900&q=80");
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
