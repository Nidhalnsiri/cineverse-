package com.cineverse.backend.service;

import com.cineverse.backend.model.*;
import com.cineverse.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
@Order(2)
public class TunisiaCatalogSeeder implements CommandLineRunner {

    @Autowired private CinemaRepository cinemaRepository;
    @Autowired private RoomRepository roomRepository;
    @Autowired private SeatRepository seatRepository;
    @Autowired private MovieRepository movieRepository;
    @Autowired private SessionRepository sessionRepository;
    @Autowired private TicketRepository ticketRepository;
    @Autowired private ReservationRepository reservationRepository;

    @Override
    @Transactional
    public void run(String... args) {
        boolean hasParis = cinemaRepository.findAll().stream()
                .anyMatch(c -> c.getAddress() != null && c.getAddress().contains("Paris"));
        if (cinemaRepository.count() >= 7 && !hasParis) {
            ensureExtraMovies();
            return;
        }
        reseedCatalog();
    }

    private void reseedCatalog() {
        ticketRepository.deleteAll();
        reservationRepository.deleteAll();
        sessionRepository.deleteAll();
        seatRepository.deleteAll();
        roomRepository.deleteAll();
        cinemaRepository.deleteAll();

        List<Cinema> cinemas = seedCinemas();
        List<Room> rooms = seedRooms(cinemas);
        rooms.forEach(room -> seedSeats(room, 8, 10, "DE"));

        List<Movie> movies = seedMovies();
        seedSessions(movies, rooms);
    }

    private void ensureExtraMovies() {
        if (movieRepository.count() >= 18) return;
        seedMovies().forEach(m -> {
            if (movieRepository.findByTitle(m.getTitle()).isEmpty()) {
                movieRepository.save(m);
            }
        });
    }

    private List<Cinema> seedCinemas() {
        List<Cinema> list = new ArrayList<>();
        list.add(cinema("Pathé Tunis City", "Pathé", "Tunis",
                "Centre Commercial Tunis City, Lac 2, 1053 Tunis",
                36.8498, 10.2565,
                "https://picsum.photos/id/312/900/500"));
        list.add(cinema("Pathé Les Berges du Lac", "Pathé", "Tunis",
                "Les Berges du Lac, 1053 Tunis",
                36.8322, 10.2425,
                "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80"));
        list.add(cinema("Azur City La Marsa", "Azur City", "La Marsa",
                "Centre Azur City, La Marsa, 2070",
                36.8780, 10.3242,
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80"));
        list.add(cinema("Le Palace Sousse", "Le Palace", "Sousse",
                "Avenue Habib Bourguiba, 4000 Sousse",
                35.8256, 10.6360,
                "https://picsum.photos/id/174/900/500"));
        list.add(cinema("Pathé Sfax", "Pathé", "Sfax",
                "Route de Tunis, Km 0.5, 3000 Sfax",
                34.7406, 10.7603,
                "https://picsum.photos/id/433/900/500"));
        list.add(cinema("Colisée Nabeul", "Colisée", "Nabeul",
                "Avenue Farhat Hached, 8000 Nabeul",
                36.4561, 10.7376,
                "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80"));
        list.add(cinema("Cinéplex Hammamet", "Cinéplex", "Hammamet",
                "Zone touristique Yasmine, 8050 Hammamet",
                36.4008, 10.6223,
                "https://picsum.photos/id/1003/900/500"));
        return cinemaRepository.saveAll(list);
    }

    private Cinema cinema(String name, String brand, String city, String address,
                          double lat, double lng, String image) {
        Cinema c = new Cinema();
        c.setName(name);
        c.setBrand(brand);
        c.setCity(city);
        c.setAddress(address);
        c.setLatitude(lat);
        c.setLongitude(lng);
        c.setImageUrl(image);
        return c;
    }

    private List<Room> seedRooms(List<Cinema> cinemas) {
        List<Room> rooms = new ArrayList<>();
        for (Cinema cinema : cinemas) {
            rooms.add(room(cinema, "Salle IMAX", 120));
            rooms.add(room(cinema, "Salle Premium", 80));
        }
        return roomRepository.saveAll(rooms);
    }

    private Room room(Cinema cinema, String name, int capacity) {
        Room r = new Room();
        r.setCinema(cinema);
        r.setName(name);
        r.setCapacity(capacity);
        return r;
    }

    private void seedSeats(Room room, int rowCount, int colCount, String vipRowLetters) {
        List<Seat> batch = new ArrayList<>();
        for (int r = 0; r < rowCount; r++) {
            char rowChar = (char) ('A' + r);
            String row = String.valueOf(rowChar);
            boolean vip = vipRowLetters.contains(row);
            for (int col = 1; col <= colCount; col++) {
                Seat seat = new Seat();
                seat.setRoom(room);
                seat.setRowNum(row);
                seat.setColNum(col);
                seat.setType(vip ? "VIP" : "Standard");
                batch.add(seat);
            }
        }
        seatRepository.saveAll(batch);
    }

    private List<Movie> seedMovies() {
        List<Movie> movies = new ArrayList<>();
        movies.add(movie("Inception",
                "Dom Cobb est un voleur expérimenté spécialisé dans l'extraction de secrets enfouis dans les rêves.",
                148, "Sci-Fi / Thriller", "Christopher Nolan", "Leonardo DiCaprio, Joseph Gordon-Levitt",
                "2010-07-16", 12,
                "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
                "https://www.youtube.com/embed/YoHD9XEInc0", 8.8));
        movies.add(movie("Interstellar",
                "Des explorateurs voyagent à travers un trou de ver pour sauver l'humanité.",
                169, "Sci-Fi / Aventure", "Christopher Nolan", "Matthew McConaughey, Anne Hathaway",
                "2014-11-05", 10,
                "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
                "https://www.youtube.com/embed/zSWdZVtXT7E", 8.6));
        movies.add(movie("The Dark Knight",
                "Batman affronte le Joker, un criminel qui plonge Gotham dans le chaos.",
                152, "Action / Crime", "Christopher Nolan", "Christian Bale, Heath Ledger",
                "2008-07-18", 12,
                "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
                "https://www.youtube.com/embed/EXeTwQWrcwY", 9.0));
        movies.add(movie("Dune",
                "Paul Atreides doit survivre sur Arrakis et mener son peuple.",
                155, "Sci-Fi / Épopée", "Denis Villeneuve", "Timothée Chalamet, Zendaya",
                "2021-09-15", 12,
                "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg",
                "https://www.youtube.com/embed/n9xhJrPXop4", 8.0));
        movies.add(movie("Avengers: Endgame",
                "Les Avengers tentent de renverser les actes de Thanos.",
                181, "Action / Super-héros", "Anthony et Joe Russo", "Robert Downey Jr., Chris Evans",
                "2019-04-26", 10,
                "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
                "https://www.youtube.com/embed/TcMBFSGVi1c", 8.4));
        movies.add(movie("The Godfather",
                "La saga de la famille Corleone dans la mafia new-yorkaise.",
                175, "Crime / Drame", "Francis Ford Coppola", "Marlon Brando, Al Pacino",
                "1972-03-24", 16,
                "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
                "https://www.youtube.com/embed/sY1S34973zA", 9.2));
        movies.add(movie("Michael Jackson's This Is It",
                "Documentaire sur les répétitions de la tournée finale jamais donnée du Roi de la Pop.",
                111, "Documentaire / Musique", "Kenny Ortega", "Michael Jackson",
                "2009-10-28", 0,
                "https://image.tmdb.org/t/p/w500/mE8fTF8vGk8VE01wOmvsLJpkYSj.jpg",
                "https://www.youtube.com/embed/ZsnfXfuGRVI", 7.2));
        movies.add(movie("Moonwalker",
                "Michael Jackson mène une aventure fantastique pour sauver des enfants et son ami Joe.",
                93, "Musique / Fantastique", "Colin Chilvers", "Michael Jackson, Joe Pesci",
                "1988-10-26", 0,
                "https://image.tmdb.org/t/p/w500/3qcbWi0Kx1lzPkO4YHqzGXZzQZQ.jpg",
                "https://www.youtube.com/embed/0wnuTGGuA7Y", 6.1));
        movies.add(movie("Bend It Like Beckham",
                "Une jeune Britannique d'origine indienne poursuit son rêve de devenir footballeuse.",
                112, "Sport / Comédie", "Gurinder Chadha", "Parminder Nagra, Keira Knightley",
                "2002-04-12", 10,
                "https://image.tmdb.org/t/p/w500/tHgcbMgU4b0bONDFjqpKXHzNdyK.jpg",
                "https://www.youtube.com/embed/5yWhrJ9wKqE", 6.7));
        movies.add(movie("Goal! The Dream Begins",
                "Un jeune Mexicain tente de percer dans le football professionnel en Europe.",
                118, "Sport / Drame", "Danny Cannon", "Kuno Becker, Alessandro Nivola",
                "2005-05-13", 10,
                "https://image.tmdb.org/t/p/w500/6NXOm8yPTDjOohB73jsOeXWbX0.jpg",
                "https://www.youtube.com/embed/1bJgyuJxX1E", 6.8));
        movies.add(movie("Remember the Titans",
                "Un entraîneur uni une équipe de football américain ségréguée dans les années 70.",
                113, "Sport / Drame", "Boaz Yakin", "Denzel Washington, Will Patton",
                "2000-09-29", 10,
                "https://image.tmdb.org/t/p/w500/7wy47Lviot5GO38iyj8UXiuK4d.jpg",
                "https://www.youtube.com/embed/TCyWJ0j_7mM", 7.8));
        movies.add(movie("Escape to Victory",
                "Des prisonniers de guerre organisent un match de football contre l'équipe nazie.",
                116, "Sport / Guerre", "John Huston", "Sylvester Stallone, Pelé, Michael Caine",
                "1981-12-25", 10,
                "https://image.tmdb.org/t/p/w500/a111EYlB4dcLU10HHpduRDV1Q8s.jpg",
                "https://www.youtube.com/embed/3t1bSJZxX0g", 6.8));
        movies.add(movie("United",
                "L'histoire de Manchester United et du crash de Munich en 1958.",
                94, "Sport / Biopic", "James Strong", "David Tennant, Jack O'Connell",
                "2011-06-24", 12,
                "https://image.tmdb.org/t/p/w500/fkmSUtvKMKzQ7Lqzsw69tfv6qR8.jpg",
                "https://www.youtube.com/embed/3t1bSJZxX0g", 7.4));
        movies.add(movie("Rush",
                "La rivalité entre James Hunt et Niki Lauda en Formule 1.",
                123, "Sport / Biopic", "Ron Howard", "Chris Hemsworth, Daniel Brühl",
                "2013-09-20", 12,
                "https://image.tmdb.org/t/p/w500/c9UmfCYoVe63XJFrpO8XqKQxlsL.jpg",
                "https://www.youtube.com/embed/4XA73L_5VzU", 8.1));
        movies.add(movie("Oppenheimer",
                "Le scientifique J. Robert Oppenheimer et la création de la bombe atomique.",
                180, "Biopic / Drame", "Christopher Nolan", "Cillian Murphy, Emily Blunt",
                "2023-07-21", 12,
                "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
                "https://www.youtube.com/embed/uYPbbksJxIg", 8.4));
        movies.add(movie("Top Gun: Maverick",
                "Pete Maverick Mitchell forme une nouvelle génération de pilotes d'élite.",
                130, "Action / Drame", "Joseph Kosinski", "Tom Cruise, Miles Teller",
                "2022-05-27", 12,
                "https://image.tmdb.org/t/p/w500/62HCn0zi32M1XoJhSfynO3gF4op.jpg",
                "https://www.youtube.com/embed/qSqVVswa420", 8.3));
        movies.add(movie("Spider-Man: No Way Home",
                "Peter Parker demande l'aide du Docteur Strange quand son identité est révélée.",
                148, "Action / Super-héros", "Jon Watts", "Tom Holland, Zendaya",
                "2021-12-17", 12,
                "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvfFTlFypwM.jpg",
                "https://www.youtube.com/embed/JfVOs4VSpmA", 8.2));
        movies.add(movie("The Batman",
                "Batman enquête sur la corruption à Gotham et affronte le Sphinx.",
                176, "Action / Crime", "Matt Reeves", "Robert Pattinson, Zoë Kravitz",
                "2022-03-04", 12,
                "https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
                "https://www.youtube.com/embed/mqqft2x_Aa4", 7.8));
        movies.add(movie("Joker",
                "L'origine d'Arthur Fleck, homme marginalisé qui devient le Joker.",
                122, "Drame / Thriller", "Todd Phillips", "Joaquin Phoenix, Robert De Niro",
                "2019-10-04", 16,
                "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
                "https://www.youtube.com/embed/zAGVQLHvwOY", 8.4));
        movies.add(movie("Barbie",
                "Barbie quitte Barbieland pour découvrir le monde réel.",
                114, "Comédie / Fantastique", "Greta Gerwig", "Margot Robbie, Ryan Gosling",
                "2023-07-21", 0,
                "https://image.tmdb.org/t/p/w500/iuFNMS7RXPBRavKVzTnFytZBZq.jpg",
                "https://www.youtube.com/embed/pBk4NYhWNMM", 6.9));

        if (movieRepository.count() == 0) {
            return movieRepository.saveAll(movies);
        }
        List<Movie> saved = new ArrayList<>();
        for (Movie m : movies) {
            saved.add(movieRepository.findByTitle(m.getTitle())
                    .map(existing -> {
                        existing.setPosterUrl(m.getPosterUrl());
                        existing.setTrailerUrl(m.getTrailerUrl());
                        existing.setDescription(m.getDescription());
                        return movieRepository.save(existing);
                    })
                    .orElseGet(() -> movieRepository.save(m)));
        }
        return saved;
    }

    private Movie movie(String title, String desc, int duration, String genre, String director,
                        String actors, String releaseDate, int minAge, String poster, String trailer, double rating) {
        Movie m = new Movie();
        m.setTitle(title);
        m.setDescription(desc);
        m.setDuration(duration);
        m.setGenre(genre);
        m.setDirector(director);
        m.setActors(actors);
        m.setReleaseDate(LocalDate.parse(releaseDate));
        m.setMinAge(minAge);
        m.setPosterUrl(poster);
        m.setTrailerUrl(trailer);
        m.setImdbRating(rating);
        return m;
    }

    private void seedSessions(List<Movie> movies, List<Room> rooms) {
        if (sessionRepository.count() > 0) return;
        Room mainRoom = rooms.get(0);
        Room premiumRoom = rooms.get(1);
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);
        String[] times = {"14:00", "16:30", "19:00", "21:30"};
        int sessionIndex = 0;
        for (Movie movie : movies) {
            for (String timeStr : times) {
                if (sessionIndex % 2 == 0) {
                    addSession(movie, mainRoom, today, timeStr, sessionIndex % 3 == 0 ? "VF" : "VO");
                } else {
                    addSession(movie, premiumRoom, tomorrow, timeStr, "VF");
                }
                sessionIndex++;
            }
        }
    }

    private void addSession(Movie movie, Room room, LocalDate date, String time, String lang) {
        Session s = new Session();
        s.setMovie(movie);
        s.setRoom(room);
        s.setDate(date);
        s.setTime(LocalTime.parse(time));
        s.setLanguage(lang);
        s.setSubtitles("VO".equals(lang) ? "FR" : null);
        s.setPrice(room.getName().contains("IMAX") ? 14.0 : 11.0);
        sessionRepository.save(s);
    }
}
