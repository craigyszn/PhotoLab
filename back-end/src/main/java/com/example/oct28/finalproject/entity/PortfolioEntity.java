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

    public Long getPortfolioId() {
        return portfolioId;
    }

    public void setPortfolioId(Long portfolioId) {
        this.portfolioId = portfolioId;
    }

    public PhotographerEntity getPhotographer() {
        return photographer;
    }

    public void setPhotographer(PhotographerEntity photographer) {
        this.photographer = photographer;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSampleImage() {
        return sampleImage;
    }

    public void setSampleImage(String sampleImage) {
        this.sampleImage = sampleImage;
    }

    public String getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(String uploadDate) {
        this.uploadDate = uploadDate;
    }
}
