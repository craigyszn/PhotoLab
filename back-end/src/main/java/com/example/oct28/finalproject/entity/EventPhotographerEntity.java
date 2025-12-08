package com.example.oct28.finalproject.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "event_photographers")   // match your table name
public class EventPhotographerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventPhotographerId;  // id PK

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private EventEntity event;         // FK to events.id

    @ManyToOne
    @JoinColumn(name = "photographer_id", nullable = false)
    private PhotographerEntity photographer; // FK to photographers.id

    private String role;
    private Double photographerFee;

    // Getters and Setters
    public Long getEventPhotographerId() { return eventPhotographerId; }
    public void setEventPhotographerId(Long eventPhotographerId) {
        this.eventPhotographerId = eventPhotographerId;
    }

    public EventEntity getEvent() { return event; }
    public void setEvent(EventEntity event) { this.event = event; }

    public PhotographerEntity getPhotographer() { return photographer; }
    public void setPhotographer(PhotographerEntity photographer) {
        this.photographer = photographer;
    }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Double getPhotographerFee() { return photographerFee; }
    public void setPhotographerFee(Double photographerFee) {
        this.photographerFee = photographerFee;
    }
}
