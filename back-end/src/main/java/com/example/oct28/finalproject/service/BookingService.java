package com.example.oct28.finalproject.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;
import com.example.oct28.finalproject.entity.BookingEntity;
import com.example.oct28.finalproject.repository.BookingRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository repo;

    public List<BookingEntity> getAll() { return repo.findAll(); }
    public Optional<BookingEntity> getById(Long id) { return repo.findById(id); }
    public BookingEntity create(BookingEntity b) { return repo.save(b); }
    public BookingEntity update(Long id, BookingEntity b) { b.setBookingId(id); return repo.save(b); }
    public void delete(Long id) { repo.deleteById(id); }
}
