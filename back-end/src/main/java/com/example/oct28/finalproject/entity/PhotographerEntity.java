package com.example.oct28.finalproject.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "photographer")
public class PhotographerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long photographerId;

    private String name;
    private String email;
    private String availability;
    private String specialization;
    private String contactNumber;

    // Getters and Setters
    public Long getPhotographerId() { return photographerId; }
    public void setPhotographerId(Long photographerId) { this.photographerId = photographerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
}
