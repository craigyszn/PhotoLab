package com.example.oct28.finalproject.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "gallery")
public class GalleryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long galleryId;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private BookingEntity booking;

    @ManyToOne
    @JoinColumn(name = "photographer_id", nullable = false)
    private PhotographerEntity photographer;

    private String uploadDate;
    private String photoUrl;
    private String photoDescription;

    // Getters and Setters
    public Long getGalleryId() { return galleryId; }
    public void setGalleryId(Long galleryId) { this.galleryId = galleryId; }

    public BookingEntity getBooking() { return booking; }
    public void setBooking(BookingEntity booking) { this.booking = booking; }

    public PhotographerEntity getPhotographer() { return photographer; }
    public void setPhotographer(PhotographerEntity photographer) {
        this.photographer = photographer;
    }

    public String getUploadDate() { return uploadDate; }
    public void setUploadDate(String uploadDate) { this.uploadDate = uploadDate; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public String getPhotoDescription() { return photoDescription; }
    public void setPhotoDescription(String photoDescription) {
        this.photoDescription = photoDescription;
    }
}
