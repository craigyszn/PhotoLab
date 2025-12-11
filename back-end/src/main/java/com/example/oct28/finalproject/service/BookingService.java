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
     * Create booking using Customer + Event IDs.
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

    /**
     * UPDATE booking (no need for customerId/eventId during update)
     */
    public BookingEntity update(Long id, BookingEntity b) {
        b.setBookingId(id);
        return bookingRepo.save(b);
    }

    public void delete(Long id) {
        bookingRepo.deleteById(id);
    }
}
