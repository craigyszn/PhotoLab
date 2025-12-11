package com.example.oct28.finalproject.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;

import com.example.oct28.finalproject.entity.CustomerEntity;
import com.example.oct28.finalproject.repository.CustomerRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository repo;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public List<CustomerEntity> getAll() { return repo.findAll(); }

    public Optional<CustomerEntity> getById(Long id) { return repo.findById(id); }

    public CustomerEntity create(CustomerEntity c) {
        if (c.getPassword() != null) {
            c.setPassword(encoder.encode(c.getPassword()));
        }
        return repo.save(c);
    }

    public CustomerEntity update(Long id, CustomerEntity c) {
        c.setCustomerId(id);
        if (c.getPassword() != null) {
            c.setPassword(encoder.encode(c.getPassword()));
        }
        return repo.save(c);
    }

    public void delete(Long id) { repo.deleteById(id); }

    public Optional<CustomerEntity> register(CustomerEntity c) {
        if (c.getEmail() == null) return Optional.empty();
        if (repo.findByEmail(c.getEmail()).isPresent()) return Optional.empty();

        // set default role if not provided
        if (c.getRole() == null || c.getRole().trim().isEmpty()) {
            c.setRole("CUSTOMER");
        }

        c.setPassword(encoder.encode(c.getPassword()));
        return Optional.of(repo.save(c));
    }

    public Optional<CustomerEntity> login(String email, String rawPassword) {
        Optional<CustomerEntity> found = repo.findByEmail(email);
        if (found.isEmpty()) return Optional.empty();
        CustomerEntity c = found.get();
        if (c.getPassword() == null) return Optional.empty();
        if (encoder.matches(rawPassword, c.getPassword())) {
            return Optional.of(c);
        }
        return Optional.empty();
    }
}
