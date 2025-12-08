package com.example.oct28.finalproject.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import com.example.oct28.finalproject.entity.EventEntity;
import com.example.oct28.finalproject.service.EventService;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:5173")
public class EventController {

    @Autowired
    private EventService service;

    @GetMapping
    public List<EventEntity> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<EventEntity> getById(@PathVariable Long id) {
        return service.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public EventEntity create(@RequestBody EventEntity e) { return service.create(e); }

    @PutMapping("/{id}")
    public ResponseEntity<EventEntity> update(@PathVariable Long id, @RequestBody EventEntity e) {
        return service.getById(id).map(existing -> ResponseEntity.ok(service.update(id, e))).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
