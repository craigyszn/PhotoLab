package com.example.oct28.finalproject.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import com.example.oct28.finalproject.entity.GalleryEntity;
import com.example.oct28.finalproject.service.GalleryService;

@RestController
@RequestMapping("/api/galleries")
@CrossOrigin(origins = "http://localhost:5173")
public class GalleryController {

    @Autowired
    private GalleryService service;

    // GET /api/galleries
    @GetMapping
    public List<GalleryEntity> getAll() {
        return service.getAll();
    }

    // GET /api/galleries/{id}
    @GetMapping("/{id}")
    public ResponseEntity<GalleryEntity> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/galleries/customer/{customerId}
    // Returns all gallery rows that belong to the given customer (via booking.customer)
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<GalleryEntity>> getByCustomer(@PathVariable Long customerId) {
        try {
            List<GalleryEntity> list = service.getByCustomer(customerId);
            return ResponseEntity.ok(list);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    // POST /api/galleries?bookingId=1&photographerId=2
    // Body: GalleryEntity JSON (uploadDate, photoUrl, photoDescription)
    @PostMapping
    public ResponseEntity<?> create(@RequestParam Long bookingId,
                                    @RequestParam Long photographerId,
                                    @RequestBody GalleryEntity g) {
        try {
            GalleryEntity saved = service.create(bookingId, photographerId, g);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // PUT /api/galleries/{id}?bookingId=1&photographerId=2
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestParam Long bookingId,
                                    @RequestParam Long photographerId,
                                    @RequestBody GalleryEntity g) {
        try {
            GalleryEntity updated = service.update(id, bookingId, photographerId, g);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // DELETE /api/galleries/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
