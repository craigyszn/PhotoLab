package com.example.oct28.finalproject.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import com.example.oct28.finalproject.entity.BookingEntity;
import com.example.oct28.finalproject.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService service;

    @GetMapping
    public List<BookingEntity> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<BookingEntity> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/bookings?customerId=1&eventId=2
    @PostMapping
    public BookingEntity create(@RequestParam Long customerId,
                                @RequestParam Long eventId,
                                @RequestBody BookingEntity b) {
        return service.create(customerId, eventId, b);
    }

    // PUT /api/bookings/{id}?customerId=1&eventId=2
    @PutMapping("/{id}")
    public ResponseEntity<BookingEntity> update(@PathVariable Long id,
                                                @RequestParam Long customerId,
                                                @RequestParam Long eventId,
                                                @RequestBody BookingEntity b) {
        return service.getById(id)
                .map(existing -> ResponseEntity.ok(service.update(id, customerId, eventId, b)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
