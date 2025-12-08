package com.example.oct28.finalproject.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;
import com.example.oct28.finalproject.entity.GalleryEntity;
import com.example.oct28.finalproject.repository.GalleryRepository;

@Service
public class GalleryService {

    @Autowired
    private GalleryRepository repo;

    public List<GalleryEntity> getAll() { return repo.findAll(); }
    public Optional<GalleryEntity> getById(Long id) { return repo.findById(id); }
    public GalleryEntity create(GalleryEntity g) { return repo.save(g); }
    public GalleryEntity update(Long id, GalleryEntity g) { g.setGalleryId(id); return repo.save(g); }
    public void delete(Long id) { repo.deleteById(id); }
}
