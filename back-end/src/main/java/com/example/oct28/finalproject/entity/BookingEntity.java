package com.example.oct28.finalproject.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "booking")   // or your existing table name
public class BookingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long bookingId;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private CustomerEntity customer;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private EventEntity event;

    /**
     * Single photographer for this booking (nullable).
     * This models the previous one-to-many cardinality: many bookings may reference one photographer.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "photographer_id", referencedColumnName = "photographer_id", nullable = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private PhotographerEntity photographer;

    private String bookingDate;
    private String status;
    private Double totalPrice;
    private String packageType;

    // --- getters / setters ---

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public CustomerEntity getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerEntity customer) {
        this.customer = customer;
    }

    public EventEntity getEvent() {
        return event;
    }

    public void setEvent(EventEntity event) {
        this.event = event;
    }

    public String getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(String bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getPackageType() {
        return packageType;
    }

    public void setPackageType(String packageType) {
        this.packageType = packageType;
    }

    // --- photographer getter / setter ---

    public PhotographerEntity getPhotographer() {
        return photographer;
    }

    public void setPhotographer(PhotographerEntity photographer) {
        this.photographer = photographer;
    }

    // Convenience transient getters used by frontend normalization (not persisted)
    @Transient
    public Long getPhotographerId() {
        return (this.photographer != null) ? this.photographer.getPhotographerId() : null;
    }

    @Transient
    public String getPhotographerName() {
        return (this.photographer != null) ? this.photographer.getName() : null;
    }
}
