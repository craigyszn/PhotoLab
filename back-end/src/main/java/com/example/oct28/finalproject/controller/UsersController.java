package com.example.oct28.finalproject.controller;

import com.example.oct28.finalproject.entity.CustomerEntity;
import com.example.oct28.finalproject.entity.PhotographerEntity;
import com.example.oct28.finalproject.repository.CustomerRepository;
import com.example.oct28.finalproject.repository.PhotographerRepository;
import com.example.oct28.finalproject.service.UserDeletionService;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UsersController {

    private final CustomerRepository customerRepo;
    private final PhotographerRepository photographerRepo;
    private final UserDeletionService deletionService;

    // Constructor injection
    public UsersController(CustomerRepository customerRepo,
                           PhotographerRepository photographerRepo,
                           UserDeletionService deletionService) {
        this.customerRepo = customerRepo;
        this.photographerRepo = photographerRepo;
        this.deletionService = deletionService;
    }

    // RETURN ALL USERS (customers + photographers)
    @GetMapping
    public List<Map<String, Object>> getAllUsers() {
        List<Map<String, Object>> result = new ArrayList<>();

        // Customers: use role from DB (CustomerEntity.getRole())
        for (CustomerEntity c : customerRepo.findAll()) {
            Map<String, Object> user = new HashMap<>();
            user.put("id", c.getCustomerId());

            String first = c.getFirstName() == null ? "" : c.getFirstName();
            String last = c.getLastName() == null ? "" : c.getLastName();
            user.put("name", (first + " " + last).trim());

            user.put("email", c.getEmail());

            // Use the DB role if available; default to CUSTOMER
            String role = c.getRole();
            if (role == null || role.isBlank()) {
                role = "CUSTOMER";
            }

            user.put("role", role.toLowerCase()); // normalize to lowercase for frontend CSS
            result.add(user);
        }

        // Photographers: keep as photographer (separate entity)
        for (PhotographerEntity p : photographerRepo.findAll()) {
            Map<String, Object> user = new HashMap<>();
            user.put("id", p.getPhotographerId());
            user.put("name", p.getName());
            user.put("email", p.getEmail());
            user.put("role", "photographer"); // photographers come from their own table
            result.add(user);
        }

        return result;
    }

    // DELETE USER (cascade delete performed server-side)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        // If customer exists, perform cascade delete (bookings + gallery + customer)
        Optional<CustomerEntity> maybeCustomer = customerRepo.findById(id);
        if (maybeCustomer.isPresent()) {
            CustomerEntity c = maybeCustomer.get();
            String role = c.getRole();
            if (role != null && "ADMIN".equalsIgnoreCase(role.trim())) {
                // Prevent deleting admin accounts via this endpoint
                return ResponseEntity.status(403).build();
            }

            deletionService.deleteCustomerCascade(id);
            return ResponseEntity.noContent().build();
        }

        // If photographer exists, just delete the photographer record
        if (photographerRepo.findById(id).isPresent()) {
            photographerRepo.deleteById(id);
            return ResponseEntity.noContent().build();
        }

        // not found
        return ResponseEntity.notFound().build();
    }
}
