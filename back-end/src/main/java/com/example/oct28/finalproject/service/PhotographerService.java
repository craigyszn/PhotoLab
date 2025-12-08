package com.example.oct28.finalproject.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;
import com.example.oct28.finalproject.entity.PhotographerEntity;
import com.example.oct28.finalproject.repository.PhotographerRepository;

@Service
public class PhotographerService {

    @Autowired
    private PhotographerRepository repo;

    public List<PhotographerEntity> getAll() { return repo.findAll(); }
    public Optional<PhotographerEntity> getById(Long id) { return repo.findById(id); }
    public PhotographerEntity create(PhotographerEntity p) { return repo.save(p); }
    public PhotographerEntity update(Long id, PhotographerEntity p) { p.setPhotographerId(id); return repo.save(p); }
    public void delete(Long id) { repo.deleteById(id); }
}
