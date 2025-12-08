package com.example.oct28.finalproject.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

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

    public List<GalleryEntity> getAll() {
        return galleryRepo.findAll();
    }

    public Optional<GalleryEntity> getById(Long id) {
        return galleryRepo.findById(id);
    }

    public GalleryEntity create(Long bookingId, Long photographerId, GalleryEntity g) {
        BookingEntity booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        PhotographerEntity photographer = photographerRepo.findById(photographerId)
                .orElseThrow(() -> new RuntimeException("Photographer not found"));

        g.setBooking(booking);
        g.setPhotographer(photographer);

        return galleryRepo.save(g);
    }

    public GalleryEntity update(Long id, Long bookingId, Long photographerId, GalleryEntity g) {
        g.setGalleryId(id);

        BookingEntity booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        PhotographerEntity photographer = photographerRepo.findById(photographerId)
                .orElseThrow(() -> new RuntimeException("Photographer not found"));

        g.setBooking(booking);
        g.setPhotographer(photographer);

        return galleryRepo.save(g);
    }

    public void delete(Long id) {
        galleryRepo.deleteById(id);
    }
}
