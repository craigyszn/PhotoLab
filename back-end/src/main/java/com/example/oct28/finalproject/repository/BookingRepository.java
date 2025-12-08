package com.example.oct28.finalproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.oct28.finalproject.entity.BookingEntity;

public interface BookingRepository extends JpaRepository<BookingEntity, Long> { }
