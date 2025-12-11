package com.example.oct28.finalproject.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import com.example.oct28.finalproject.entity.BookingEntity;
import com.example.oct28.finalproject.entity.PhotographerEntity;
import com.example.oct28.finalproject.repository.BookingRepository;
import com.example.oct28.finalproject.repository.PhotographerRepository;
import com.example.oct28.finalproject.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingService service;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PhotographerRepository photographerRepository;

    @GetMapping
    public List<BookingEntity> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingEntity> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/bookings?customerId=1&eventId=2
    @PostMapping
    public BookingEntity create(
            @RequestParam Long customerId,
            @RequestParam Long eventId,
            @RequestBody BookingEntity b) {
        return service.create(customerId, eventId, b);
    }

    // PUT /api/bookings/{id}
    @PutMapping("/{id}")
    public ResponseEntity<BookingEntity> update(@PathVariable Long id,
                                                @RequestBody BookingEntity b) {
        return service.getById(id)
                .map(existing -> ResponseEntity.ok(service.update(id, b)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // PATCH /api/bookings/{id}/status
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestBody Map<String, String> body) {

        String status = body.get("status");

        return service.getById(id).map(booking -> {
            booking.setStatus(status);
            service.update(id, booking);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Assign or clear a single photographer for a booking.
     * Expects body like: { "photographerId": 5 } or { "photographerId": null } to unassign.
     */
    @PatchMapping("/{id}/photographer")
    @Transactional
    public ResponseEntity<?> assignPhotographer(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Object raw = body.get("photographerId");

        return bookingRepository.findById(id).map(booking -> {
            if (raw == null) {
                // clear photographer
                booking.setPhotographer(null);
                bookingRepository.save(booking);
                return ResponseEntity.ok().build();
            } else {
                Long photographerId;
                try {
                    // handle numbers coming as Integer or Double in JSON parsing
                    if (raw instanceof Number) {
                        photographerId = ((Number) raw).longValue();
                    } else {
                        photographerId = Long.parseLong(raw.toString());
                    }
                } catch (Exception ex) {
                    return ResponseEntity.badRequest().body("Invalid photographerId");
                }

                return photographerRepository.findById(photographerId).map(p -> {
                    booking.setPhotographer(p);
                    bookingRepository.save(booking);
                    return ResponseEntity.ok().build();
                }).orElseGet(() -> ResponseEntity.status(404).body("Photographer not found"));
            }
        }).orElse(ResponseEntity.notFound().build());
    }
}
