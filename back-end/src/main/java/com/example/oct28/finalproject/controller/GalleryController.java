package com.example.oct28.finalproject.controller;

import com.example.oct28.finalproject.entity.GalleryEntity;
import com.example.oct28.finalproject.service.GalleryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/galleries")
@CrossOrigin(origins = "http://localhost:5173")
public class GalleryController {

    private final GalleryService service;

    public GalleryController(GalleryService service) {
        this.service = service;
    }

    // GET /api/galleries (optional query params)
    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) Long customerId,
                                    @RequestParam(required = false) Long bookingId) {
        try {
            if (bookingId != null) {
                List<GalleryEntity> byBooking = service.getByBookingId(bookingId);
                return ResponseEntity.ok(byBooking);
            }
            if (customerId != null) {
                List<GalleryEntity> byCustomer = service.getByCustomerId(customerId);
                return ResponseEntity.ok(byCustomer);
            }
            return ResponseEntity.ok(service.getAll());
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to load galleries from server.");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<GalleryEntity> getById(@PathVariable Long id) {
        return service.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Create single JSON-backed gallery record:
    @PostMapping
    public ResponseEntity<?> create(@RequestParam Long bookingId,
                                    @RequestParam Long photographerId,
                                    @RequestBody GalleryEntity g) {
        try {
            GalleryEntity saved = service.create(bookingId, photographerId, g);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    /**
     * Upload photos endpoint (multipart)
     * POST /api/galleries/{bookingId}/photos?photographerId=1
     * form-data: files (one or more)
     */
    @PostMapping("/{bookingId}/photos")
    public ResponseEntity<?> uploadPhotos(@PathVariable Long bookingId,
                                          @RequestParam("photographerId") Long photographerId,
                                          @RequestParam("files") MultipartFile[] files) {

        // Quick validation for helpful client errors
        if (photographerId == null) {
            return ResponseEntity.badRequest().body("photographerId query parameter is required.");
        }
        if (files == null || files.length == 0) {
            return ResponseEntity.badRequest().body("No files provided. Use form-data key 'files'.");
        }

        try {
            List<GalleryEntity> created = service.uploadPhotos(bookingId, photographerId, files);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException ex) {
            // Resource or request problem -> 400
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error while uploading files.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
