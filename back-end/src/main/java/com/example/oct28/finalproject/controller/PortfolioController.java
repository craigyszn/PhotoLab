package com.example.oct28.finalproject.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import com.example.oct28.finalproject.entity.PortfolioEntity;
import com.example.oct28.finalproject.service.PortfolioService;

@RestController
@RequestMapping("/api/portfolios")
@CrossOrigin(origins = "*")
public class PortfolioController {

    @Autowired
    private PortfolioService service;

    @GetMapping
    public List<PortfolioEntity> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<PortfolioEntity> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/portfolios?photographerId=1
    @PostMapping
    public PortfolioEntity create(@RequestParam Long photographerId,
                                  @RequestBody PortfolioEntity p) {
        return service.create(photographerId, p);
    }

    // PUT /api/portfolios/{id}?photographerId=1
    @PutMapping("/{id}")
    public ResponseEntity<PortfolioEntity> update(@PathVariable Long id,
                                                  @RequestParam Long photographerId,
                                                  @RequestBody PortfolioEntity p) {
        return service.getById(id)
                .map(existing -> ResponseEntity.ok(
                        service.update(id, photographerId, p)
                ))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
