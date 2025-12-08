package com.example.oct28.finalproject.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

import com.example.oct28.finalproject.entity.BookingEntity;
import com.example.oct28.finalproject.entity.CustomerEntity;
import com.example.oct28.finalproject.entity.EventEntity;
import com.example.oct28.finalproject.repository.BookingRepository;
import com.example.oct28.finalproject.repository.CustomerRepository;
import com.example.oct28.finalproject.repository.EventRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepo;

    @Autowired
    private CustomerRepository customerRepo;

    @Autowired
    private EventRepository eventRepo;

    public List<BookingEntity> getAll() {
        return bookingRepo.findAll();
    }

    public Optional<BookingEntity> getById(Long id) {
        return bookingRepo.findById(id);
    }

    /**
     * Create booking and attach Customer + Event using their IDs.
     */
    public BookingEntity create(Long customerId, Long eventId, BookingEntity b) {
        CustomerEntity customer = customerRepo.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        EventEntity event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        b.setCustomer(customer);
        b.setEvent(event);

        return bookingRepo.save(b);
    }

    public BookingEntity update(Long id, Long customerId, Long eventId, BookingEntity b) {
        b.setBookingId(id);

        CustomerEntity customer = customerRepo.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        EventEntity event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        b.setCustomer(customer);
        b.setEvent(event);

        return bookingRepo.save(b);
    }

    public void delete(Long id) {
        bookingRepo.deleteById(id);
    }
}
