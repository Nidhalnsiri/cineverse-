package com.cineverse.backend.payload.response;

import java.time.LocalDateTime;
import java.util.List;

public class ReservationResponse {
    private Long id;
    private String status;
    private LocalDateTime reservationDate;
    private Double totalPrice;
    private String movieTitle;
    private String sessionDate;
    private String sessionTime;
    private String cinemaName;
    private String cinemaCity;
    private String cinemaAddress;
    private String roomName;
    private List<String> seatLabels;

    public ReservationResponse(Long id, String status, LocalDateTime reservationDate, Double totalPrice,
                               String movieTitle, String sessionDate, String sessionTime,
                               String cinemaName, String cinemaCity, String cinemaAddress,
                               String roomName, List<String> seatLabels) {
        this.id = id;
        this.status = status;
        this.reservationDate = reservationDate;
        this.totalPrice = totalPrice;
        this.movieTitle = movieTitle;
        this.sessionDate = sessionDate;
        this.sessionTime = sessionTime;
        this.cinemaName = cinemaName;
        this.cinemaCity = cinemaCity;
        this.cinemaAddress = cinemaAddress;
        this.roomName = roomName;
        this.seatLabels = seatLabels;
    }

    public Long getId() { return id; }
    public String getStatus() { return status; }
    public LocalDateTime getReservationDate() { return reservationDate; }
    public Double getTotalPrice() { return totalPrice; }
    public String getMovieTitle() { return movieTitle; }
    public String getSessionDate() { return sessionDate; }
    public String getSessionTime() { return sessionTime; }
    public String getCinemaName() { return cinemaName; }
    public String getCinemaCity() { return cinemaCity; }
    public String getCinemaAddress() { return cinemaAddress; }
    public String getRoomName() { return roomName; }
    public List<String> getSeatLabels() { return seatLabels; }
}
