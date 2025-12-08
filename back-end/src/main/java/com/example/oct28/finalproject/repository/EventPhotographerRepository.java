package com.example.oct28.finalproject.repository;

import com.example.oct28.finalproject.entity.EventPhotographerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventPhotographerRepository
        extends JpaRepository<EventPhotographerEntity, Long> {

    // all photographers for one event
    List<EventPhotographerEntity> findByEvent_EventId(Long eventId);

    // all events for one photographer
    List<EventPhotographerEntity> findByPhotographer_PhotographerId(Long photographerId);
}
