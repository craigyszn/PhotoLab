package com.example.oct28.finalproject.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.example.oct28.finalproject.entity.GalleryEntity;
import com.example.oct28.finalproject.entity.BookingEntity;
import com.example.oct28.finalproject.entity.PhotographerEntity;
import com.example.oct28.finalproject.repository.GalleryRepository;
import com.example.oct28.finalproject.repository.BookingRepository;
import com.example.oct28.finalproject.repository.PhotographerRepository;

@Service
public class GalleryService {

    @Autowired
    private GalleryRepository galleryRepo;

    @Autowired
    private BookingRepository bookingRepo;

    @Autowired
    private PhotographerRepository photographerRepo;

    // Return all gallery rows
    public List<GalleryEntity> getAll() {
        return galleryRepo.findAll();
    }

    // Find by id
    public Optional<GalleryEntity> getById(Long id) {
        return galleryRepo.findById(id);
    }

    /**
     * Create a GalleryEntity row (one photo).
     * We fetch BookingEntity and PhotographerEntity and set them on the GalleryEntity.
     * We do not modify BookingEntity or PhotographerEntity.
     */
    public GalleryEntity create(Long bookingId, Long photographerId, GalleryEntity g) {
        BookingEntity booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found (id=" + bookingId + ")"));

        PhotographerEntity photographer = photographerRepo.findById(photographerId)
                .orElseThrow(() -> new RuntimeException("Photographer not found (id=" + photographerId + ")"));

        // set relation objects
        g.setBooking(booking);
        g.setPhotographer(photographer);

        return galleryRepo.save(g);
    }

    /**
     * Update an existing gallery row by id.
     * We validate existence and set relation objects from provided ids.
     */
    public GalleryEntity update(Long id, Long bookingId, Long photographerId, GalleryEntity g) {
        // ensure target exists
        GalleryEntity existing = galleryRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Gallery not found (id=" + id + ")"));

        BookingEntity booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found (id=" + bookingId + ")"));

        PhotographerEntity photographer = photographerRepo.findById(photographerId)
                .orElseThrow(() -> new RuntimeException("Photographer not found (id=" + photographerId + ")"));

        // ensure the entity has the correct id (so save will update)
        g.setGalleryId(id);

        // set relation objects
        g.setBooking(booking);
        g.setPhotographer(photographer);

        return galleryRepo.save(g);
    }

    // Delete gallery row
    public void delete(Long id) {
        galleryRepo.deleteById(id);
    }

    /**
     * Return all gallery rows for a customer.
     * This uses a repository query that navigates: gallery.booking.customer.customerId
     * Make sure your GalleryRepository declares:
     *   List<GalleryEntity> findByBooking_Customer_CustomerId(Long customerId);
     */
    public List<GalleryEntity> getByCustomer(Long customerId) {
        return galleryRepo.findByBooking_Customer_CustomerId(customerId);
    }
}
