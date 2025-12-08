package com.example.oct28.finalproject.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "event")
public class EventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId;

    private String eventName;
    private String eventType;
    private Double basePrice;
    private String eventDate;   // you can switch to LocalDate later
    private String timeStart;   // or LocalTime
    private String timeEnd;
    private String location;

    // Getters and Setters
    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public Double getBasePrice() { return basePrice; }
    public void setBasePric
