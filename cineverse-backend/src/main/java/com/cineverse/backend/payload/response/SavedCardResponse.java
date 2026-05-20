package com.cineverse.backend.payload.response;

public class SavedCardResponse {
    private boolean registered;
    private String cardType;
    private String cardHolder;
    private String cardLastFour;
    private String expiry;
    private String message;

    public SavedCardResponse(boolean registered, String cardType, String cardHolder,
                             String cardLastFour, String expiry, String message) {
        this.registered = registered;
        this.cardType = cardType;
        this.cardHolder = cardHolder;
        this.cardLastFour = cardLastFour;
        this.expiry = expiry;
        this.message = message;
    }

    public boolean isRegistered() { return registered; }
    public String getCardType() { return cardType; }
    public String getCardHolder() { return cardHolder; }
    public String getCardLastFour() { return cardLastFour; }
    public String getExpiry() { return expiry; }
    public String getMessage() { return message; }
}
