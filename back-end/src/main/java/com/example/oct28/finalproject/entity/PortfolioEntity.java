package com.example.oct28.finalproject.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "portfolio")
public class PortfolioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long portfolioId;

    @ManyToOne
    @JoinColumn(name = "photographer_id", nullable = false)
    private PhotographerEntity photographer;

    private String title;
    private String description;
    private String sampleImage;
    private String uploadDate;

    // Getters and Setters
    public Long getPortfolioId() { return portfolioId; }
    public void setPortfolioId(Long portfolioId) { this.portfolioId = portfolioId; }

    public PhotographerEntity getPhotographer() { return photographer; }
    public void setPhotographer(PhotographerEntity photographer) {
        this.photographer = photographer;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() 
}
