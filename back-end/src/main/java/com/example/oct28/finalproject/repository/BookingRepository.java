package com.example.oct28.finalproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import com.example.oct28.finalproject.entity.BookingEntity;

public interface BookingRepository extends JpaRepository<BookingEntity, Long> {
    long countByStatus(String status);

    // explicit JPQL to find bookings by customer id
    @Query("SELECT b FROM BookingEntity b WHERE b.customer.customerId = :customerId")
    List<BookingEntity> findByCustomerCustomerId(Long customerId);

    // delete bookings for a customer
    @Modifying
    @Transactional
    @Query("DELETE FROM BookingEntity b WHERE b.customer.customerId = :customerId")
    void deleteByCustomerCustomerId(Long customerId);
}
