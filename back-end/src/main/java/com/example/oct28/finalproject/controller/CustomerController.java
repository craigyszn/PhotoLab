package com.example.oct28.finalproject.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;

import com.example.oct28.finalproject.entity.CustomerEntity;
import com.example.oct28.finalproject.service.CustomerService;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:3000") // allow frontend dev origin
public class CustomerController {

    @Autowired
    private CustomerService service;

    @GetMapping
    public List<CustomerEntity> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerEntity> getById(@PathVariable Long id) {
        return service.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Legacy create endpoint (keeps behavior similar to previous).
     * This will hash password because service.create() does hashing.
     */
    @PostMapping
    public ResponseEntity<?> create(@RequestBody CustomerEntity c) {
        CustomerEntity saved = service.create(c);
        return ResponseEntity.ok(saved);
    }

    /**
     * Register endpoint (recommended for frontend use)
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody CustomerEntity c) {
        Optional<CustomerEntity> saved = service.register(c);
        if (saved.isEmpty()) {
            return ResponseEntity.badRequest().body("Email already used");
        }
        // return saved user (note: password is hashed in DB)
        CustomerEntity user = saved.get();
        // remove password field from response for safety (optional)
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    /**
     * Login - accepts { "email": "...", "password": "..." }
     * Returns 200 with customer (password omitted) or 401.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody CustomerEntity req) {
        Optional<CustomerEntity> user = service.login(req.getEmail(), req.getPassword());
        if (user.isPresent()) {
            CustomerEntity u = user.get();
            // do not return password
            u.setPassword(null);
            return ResponseEntity.ok(u);
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerEntity> update(@PathVariable Long id, @RequestBody CustomerEntity c) {
        return service.getById(id)
                .map(existing -> ResponseEntity.ok(service.update(id, c)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
