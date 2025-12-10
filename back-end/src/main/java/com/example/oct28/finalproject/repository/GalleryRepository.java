package com.example.oct28.finalproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.example.oct28.finalproject.entity.GalleryEntity;

public interface GalleryRepository extends JpaRepository<GalleryEntity, Long> {

    // NEW: find all gallery photos belonging to a specific customer
    List<GalleryEntity> findByBooking_Customer_CustomerId(Long customerId);
    
}
