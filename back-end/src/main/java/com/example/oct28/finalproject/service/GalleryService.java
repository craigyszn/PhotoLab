package com.example.oct28.finalproject.service;

import com.example.oct28.finalproject.entity.GalleryEntity;
import com.example.oct28.finalproject.entity.BookingEntity;
import com.example.oct28.finalproject.entity.PhotographerEntity;
import com.example.oct28.finalproject.repository.BookingRepository;
import com.example.oct28.finalproject.repository.GalleryRepository;
import com.example.oct28.finalproject.repository.PhotographerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class GalleryService {

    private static final Logger logger = LoggerFactory.getLogger(GalleryService.class);

    // You can change this path or make it configurable via application.properties
    private static final Path UPLOAD_ROOT = Paths.get("uploads");

    private final GalleryRepository galleryRepo;
    private final BookingRepository bookingRepo;
    private final PhotographerRepository photographerRepo;

    public GalleryService(GalleryRepository galleryRepo,
                          BookingRepository bookingRepo,
                          PhotographerRepository photographerRepo) {
        this.galleryRepo = galleryRepo;
        this.bookingRepo = bookingRepo;
        this.photographerRepo = photographerRepo;

        // Ensure upload dir exists
        try {
            if (!Files.exists(UPLOAD_ROOT)) {
                Files.createDirectories(UPLOAD_ROOT);
                logger.info("Created upload directory: {}", UPLOAD_ROOT.toAbsolutePath());
            }
        } catch (IOException ex) {
            logger.error("Failed to create upload directory '{}': {}", UPLOAD_ROOT, ex.getMessage(), ex);
        }
    }

    public List<GalleryEntity> getAll() {
        return galleryRepo.findAll();
    }

    public java.util.Optional<GalleryEntity> getById(Long id) {
        return galleryRepo.findById(id);
    }

    public List<GalleryEntity> getByBookingId(Long bookingId) {
        try {
            return galleryRepo.findByBookingBookingId(bookingId);
        } catch (Exception ex) {
            logger.error("Error fetching galleries by bookingId {}: {}", bookingId, ex.getMessage(), ex);
            return Collections.emptyList();
        }
    }

    /**
     * Defensive: fetch galleries for a customer.
     * We try the JPA path first, then fall back to a native query that uses booking.customer_id.
     * Any exception returns an empty list (prevents 500 for bad/missing relational data).
     */
    public List<GalleryEntity> getByCustomerId(Long customerId) {
        if (customerId == null) return Collections.emptyList();

        try {
            // first attempt using JPA path (normal case)
            List<GalleryEntity> list = galleryRepo.findByBookingCustomerCustomerId(customerId);
            if (list != null && !list.isEmpty()) {
                return list;
            }
            // if empty, try native fallback (covers cases where mapping is inconsistent)
            List<GalleryEntity> nativeList = galleryRepo.findByCustomerIdNative(customerId);
            return nativeList == null ? Collections.emptyList() : nativeList;
        } catch (Exception ex) {
            logger.warn("findByBookingCustomerCustomerId failed for customerId={} ; falling back to native query. error: {}", customerId, ex.getMessage());
            try {
                List<GalleryEntity> nativeList = galleryRepo.findByCustomerIdNative(customerId);
                return nativeList == null ? Collections.emptyList() : nativeList;
            } catch (Exception ex2) {
                logger.error("Native findByCustomerIdNative also failed for customerId={}: {}", customerId, ex2.getMessage(), ex2);
                // return empty list rather than propagate exception
                return Collections.emptyList();
            }
        }
    }

    /**
     * Create a single gallery row linking booking + photographer (photoUrl in g)
     */
    public GalleryEntity create(Long bookingId, Long photographerId, GalleryEntity g) {
        BookingEntity booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + bookingId));

        PhotographerEntity photographer = photographerRepo.findById(photographerId)
                .orElseThrow(() -> new IllegalArgumentException("Photographer not found with id: " + photographerId));

        g.setBooking(booking);
        g.setPhotographer(photographer);

        return galleryRepo.save(g);
    }

    /**
     * Upload multiple files for a booking. photographerId is required.
     */
    public List<GalleryEntity> uploadPhotos(Long bookingId, Long photographerId, MultipartFile[] files) {
        // validate booking
        BookingEntity booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + bookingId));

        // require photographerId (Option A)
        if (photographerId == null) {
            throw new IllegalArgumentException("photographerId is required for uploading photos.");
        }

        PhotographerEntity photographer = photographerRepo.findById(photographerId)
                .orElseThrow(() -> new IllegalArgumentException("Photographer not found with id: " + photographerId));

        // ensure uploads directory exists (extra check)
        try {
            if (!Files.exists(UPLOAD_ROOT)) {
                Files.createDirectories(UPLOAD_ROOT);
            }
        } catch (IOException ex) {
            throw new RuntimeException("Failed to create uploads directory", ex);
        }

        List<GalleryEntity> created = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                continue;
            }

            // sanitize and create filename
            String original = Paths.get(file.getOriginalFilename()).getFileName().toString();
            String safeName = System.currentTimeMillis() + "-" + original.replaceAll("[^a-zA-Z0-9\\.\\-\\_]", "_");
            Path dest = UPLOAD_ROOT.resolve(safeName);

            try {
                Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);
                logger.info("Saved upload: {}", dest.toAbsolutePath());
            } catch (IOException ex) {
                logger.error("Failed to save file {}: {}", original, ex.getMessage(), ex);
                throw new RuntimeException("Failed to save file: " + original, ex);
            }

            GalleryEntity g = new GalleryEntity();
            g.setBooking(booking);
            g.setPhotographer(photographer);
            g.setUploadDate(java.time.LocalDate.now().toString());
            // adjust URL mapping if you serve uploads from a different static location
            g.setPhotoUrl("/uploads/" + safeName);
            g.setPhotoDescription(original);
            created.add(g);
        }

        // save all created rows
        List<GalleryEntity> saved = galleryRepo.saveAll(created);
        logger.info("Created {} gallery rows for bookingId={} photographerId={}", saved.size(), bookingId, photographerId);
        return saved;
    }

    public void delete(Long id) {
        galleryRepo.deleteById(id);
    }
}
