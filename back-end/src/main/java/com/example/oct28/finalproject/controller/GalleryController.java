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

    @GetMapping
    public List<GalleryEntity> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<GalleryEntity> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/galleries?bookingId=1&photographerId=2
    @PostMapping
    public GalleryEntity create(@RequestParam Long bookingId,
                                @RequestParam Long photographerId,
                                @RequestBody GalleryEntity g) {
        return service.create(bookingId, photographerId, g);
    }

    // PUT /api/galleries/{id}?bookingId=1&photographerId=2
    @PutMapping("/{id}")
    public ResponseEntity<GalleryEntity> update(@PathVariable Long id,
                                                @RequestParam Long bookingId,
                                                @RequestParam Long photographerId,
                                                @RequestBody GalleryEntity g) {
        return service.getById(id)
                .map(existing -> ResponseEntity.ok(
                        service.update(id, bookingId, photographerId, g)
                ))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
