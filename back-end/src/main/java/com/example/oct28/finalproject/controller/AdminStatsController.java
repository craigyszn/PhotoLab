package com.example.oct28.finalproject.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.oct28.finalproject.repository.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminStatsController {

    @Autowired private CustomerRepository customerRepo;
    @Autowired private BookingRepository bookingRepo;
    @Autowired private PhotographerRepository photographerRepo;

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> map = new HashMap<>();

        map.put("totalUsers", customerRepo.count() + photographerRepo.count());
        map.put("totalBookings", bookingRepo.count());
        map.put("pendingBookings", bookingRepo.countByStatus("Pending"));
        map.put("completedBookings", bookingRepo.countByStatus("Completed"));
        map.put("totalPhotographers", photographerRepo.count());

        return map;
    }
}
