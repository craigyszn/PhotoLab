package com.example.oct28.finalproject.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;

import com.example.oct28.finalproject.entity.PhotographerEntity;
import com.example.oct28.finalproject.service.PhotographerService;

@RestController
@RequestMapping("/api/photographers")
@CrossOrigin(origins = "http://localhost:5173")
public class PhotographerController {

    @Autowired
    private PhotographerService service;

    @GetMapping
    public List<PhotographerEntity> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhotographerEntity> getById(@PathVariable Long id) {
        return service.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PhotographerEntity create(@RequestBody PhotographerEntity p) {
        return service.create(p);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PhotographerEntity> update(@PathVariable Long id, @RequestBody PhotographerEntity p) {
        return service.getById(id)
                .map(existing -> ResponseEntity.ok(service.update(id, p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * PATCH /api/photographers/{id}/availability
     * Body: { "availability": "yes" } or { "availability": "no" }
     * Updates the availability field of the photographer.
     */
    @PatchMapping("/{id}/availability")
    public ResponseEntity<?> updateAvailability(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String availability = body.get("availability");
        if (availability == null) {
            return ResponseEntity.badRequest().body("Missing 'availability' field (expected 'yes' or 'no').");
        }

        return service.getById(id).map(p -> {
            p.setAvailability(availability);
            service.update(id, p);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
