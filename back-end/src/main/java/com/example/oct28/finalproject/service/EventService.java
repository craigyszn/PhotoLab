package com.example.oct28.finalproject.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;
import com.example.oct28.finalproject.entity.EventEntity;
import com.example.oct28.finalproject.repository.EventRepository;

@Service
public class EventService {

    @Autowired
    private EventRepository repo;

    public List<EventEntity> getAll() { return repo.findAll(); }
    public Optional<EventEntity> getById(Long id) { return repo.findById(id); }
    public EventEntity create(EventEntity e) { return repo.save(e); }
    public EventEntity update(Long id, EventEntity e) { e.setEventId(id); return repo.save(e); }
    public void delete(Long id) { repo.deleteById(id); }
}
