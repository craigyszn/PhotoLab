package com.example.oct28.finalproject.service;

import com.example.oct28.finalproject.entity.BookingEntity;
import com.example.oct28.finalproject.repository.BookingRepository;
import com.example.oct28.finalproject.repository.CustomerRepository;
import com.example.oct28.finalproject.repository.GalleryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserDeletionService {

    private final CustomerRepository customerRepo;
    private final BookingRepository bookingRepo;
    private final GalleryRepository galleryRepo;

    public UserDeletionService(CustomerRepository customerRepo,
                               BookingRepository bookingRepo,
                               GalleryRepository galleryRepo) {
        this.customerRepo = customerRepo;
        this.bookingRepo = bookingRepo;
        this.galleryRepo = galleryRepo;
    }

    /**
     * Delete a customer and all dependent bookings + gallery rows
     */
    @Transactional
    public void deleteCustomerCascade(Long customerId) {
        // get all bookings connected to this customer
        List<BookingEntity> bookings = bookingRepo.findByCustomerCustomerId(customerId);

        // delete gallery rows for each booking
        for (BookingEntity b : bookings) {
            if (b != null && b.getBookingId() != null) {
                galleryRepo.deleteByBookingBookingId(b.getBookingId());
            }
        }

        // delete bookings
        bookingRepo.deleteByCustomerCustomerId(customerId);

        // delete customer
        customerRepo.deleteById(customerId);
    }
}
