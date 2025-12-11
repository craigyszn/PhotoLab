package com.example.oct28.finalproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import com.example.oct28.finalproject.entity.GalleryEntity;

public interface GalleryRepository extends JpaRepository<GalleryEntity, Long> {
    // find by booking id (explicit)
    @Query("SELECT g FROM GalleryEntity g WHERE g.booking.bookingId = :bookingId")
    List<GalleryEntity> findByBookingBookingId(Long bookingId);

    // find by customer's id (explicit via JPA path) - keep for normal cases
    @Query("SELECT g FROM GalleryEntity g WHERE g.booking.customer.customerId = :customerId")
    List<GalleryEntity> findByBookingCustomerCustomerId(Long customerId);

    // Native fallback query: select galleries where booking.customer_id = :customerId
    // This uses DB columns directly and avoids complex JPA joins if mapping is inconsistent
    @Query(value = "SELECT g.* FROM gallery g WHERE g.booking_id IN (SELECT b.booking_id FROM booking b WHERE b.customer_id = :customerId)", nativeQuery = true)
    List<GalleryEntity> findByCustomerIdNative(Long customerId);

    // delete gallery rows by booking id
    @Modifying
    @Transactional
    @Query("DELETE FROM GalleryEntity g WHERE g.booking.bookingId = :bookingId")
    void deleteByBookingBookingId(Long bookingId);

    // delete gallery rows for a customer's bookings
    @Modifying
    @Transactional
    @Query("DELETE FROM GalleryEntity g WHERE g.booking.customer.customerId = :customerId")
    void deleteByBookingCustomerCustomerId(Long customerId);
}
