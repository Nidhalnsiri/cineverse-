package com.cineverse.backend.service;

import com.cineverse.backend.model.Movie;
import com.cineverse.backend.repository.MovieRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Met à jour chaque film avec son affiche TMDB officielle (une image unique par titre).
 */
@Component
@Order(3)
public class MoviePosterSync implements CommandLineRunner {

  private static final String TMDB_IMG = "https://image.tmdb.org/t/p/w500";

  /** Titres exacts → ID TMDB */
  private static final Map<String, Integer> TMDB_IDS = new LinkedHashMap<>();

  static {
    TMDB_IDS.put("Inception", 27205);
    TMDB_IDS.put("Interstellar", 157336);
    TMDB_IDS.put("The Dark Knight", 155);
    TMDB_IDS.put("Dune", 438631);
    TMDB_IDS.put("Avengers: Endgame", 299534);
    TMDB_IDS.put("The Godfather", 238);
    TMDB_IDS.put("Michael Jackson's This Is It", 26900);
    TMDB_IDS.put("Moonwalker", 17466);
    TMDB_IDS.put("Bend It Like Beckham", 455);
    TMDB_IDS.put("Goal! The Dream Begins", 9763);
    TMDB_IDS.put("Remember the Titans", 10637);
    TMDB_IDS.put("Escape to Victory", 11596);
    TMDB_IDS.put("United", 62441);
    TMDB_IDS.put("Rush", 9675);
    TMDB_IDS.put("Oppenheimer", 872585);
    TMDB_IDS.put("Top Gun: Maverick", 361743);
    TMDB_IDS.put("Spider-Man: No Way Home", 634649);
    TMDB_IDS.put("The Batman", 414906);
    TMDB_IDS.put("Joker", 475557);
    TMDB_IDS.put("Barbie", 346698);
  }

  /** Affiches TMDB vérifiées (une URL unique par film) */
  private static final Map<String, String> STATIC_POSTERS = Map.ofEntries(
      Map.entry("Inception", TMDB_IMG + "/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg"),
      Map.entry("Interstellar", TMDB_IMG + "/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg"),
      Map.entry("The Dark Knight", TMDB_IMG + "/qJ2tW6WMUDux911r6m7haRef0WH.jpg"),
      Map.entry("Dune", TMDB_IMG + "/gDzOcq0pfeCeqMBwKIJlSmQpjkZ.jpg"),
      Map.entry("Avengers: Endgame", TMDB_IMG + "/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg"),
      Map.entry("The Godfather", TMDB_IMG + "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg"),
      Map.entry("Michael Jackson's This Is It", TMDB_IMG + "/44KTRoayojxpzti2okBZGKmjEGM.jpg"),
      Map.entry("Moonwalker", TMDB_IMG + "/95mcKAcTgvonhx3BS5psLguyEVu.jpg"),
      Map.entry("Bend It Like Beckham", TMDB_IMG + "/2dzSBmFWWqt8NbnubJKIWU21Y86.jpg"),
      Map.entry("Goal! The Dream Begins", TMDB_IMG + "/9YZhJGoIbJtrjDYbENGhR6f6SZE.jpg"),
      Map.entry("Remember the Titans", TMDB_IMG + "/825ohvC4wZ3gCuncCaqkWeQnK8h.jpg"),
      Map.entry("Escape to Victory", TMDB_IMG + "/q5BWxfL1x34nyYSvA3Qo5odleGW.jpg"),
      Map.entry("United", TMDB_IMG + "/kWWa20kIjk4B6OtRHqWj41HHmiN.jpg"),
      Map.entry("Rush", TMDB_IMG + "/zOsaxYLgvZVU7cJBpPn8CuE0MrP.jpg"),
      Map.entry("Oppenheimer", TMDB_IMG + "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"),
      Map.entry("Top Gun: Maverick", TMDB_IMG + "/n0YuM4f5lvGAP6MAW2kBIzugXnc.jpg"),
      Map.entry("Spider-Man: No Way Home", TMDB_IMG + "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg"),
      Map.entry("The Batman", TMDB_IMG + "/74xTEgt7R36Fpooo50r9T25onhq.jpg"),
      Map.entry("Joker", TMDB_IMG + "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg"),
      Map.entry("Barbie", TMDB_IMG + "/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg")
  );

  @Autowired private MovieRepository movieRepository;

  @Value("${tmdb.api-key:}")
  private String tmdbApiKey;

  private final RestTemplate restTemplate = new RestTemplate();
  private final ObjectMapper objectMapper = new ObjectMapper();

  @Override
  public void run(String... args) {
    for (Movie movie : movieRepository.findAll()) {
      String poster = resolvePoster(movie.getTitle());
      if (poster != null && !poster.equals(movie.getPosterUrl())) {
        movie.setPosterUrl(poster);
        movieRepository.save(movie);
      }
    }
  }

  private String resolvePoster(String title) {
    Integer tmdbId = TMDB_IDS.get(title);
    if (tmdbId != null && tmdbApiKey != null && !tmdbApiKey.isBlank()) {
      String fromApi = fetchFromTmdb(tmdbId);
      if (fromApi != null) return fromApi;
    }
    return STATIC_POSTERS.get(title);
  }

  private String fetchFromTmdb(int tmdbId) {
    try {
      String url = "https://api.themoviedb.org/3/movie/" + tmdbId + "?api_key=" + tmdbApiKey;
      String body = restTemplate.getForObject(url, String.class);
      JsonNode root = objectMapper.readTree(body);
      JsonNode path = root.get("poster_path");
      if (path != null && !path.isNull() && !path.asText().isBlank()) {
        return TMDB_IMG + path.asText();
      }
    } catch (Exception e) {
      System.out.println("TMDB poster fetch failed for id " + tmdbId + ": " + e.getMessage());
    }
    return null;
  }
}
