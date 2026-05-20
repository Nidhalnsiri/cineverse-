package com.cineverse.backend.payload.request;
import java.util.List;
public class ReservationRequest {
    private Long userId;
    private Long sessionId;
    private List<Long> seatIds;
    private PaymentCardRequest payment;
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
    public List<Long> getSeatIds() { return seatIds; }
    public void setSeatIds(List<Long> seatIds) { this.seatIds = seatIds; }
    public PaymentCardRequest getPayment() { return payment; }
    public void setPayment(PaymentCardRequest payment) { this.payment = payment; }
}
