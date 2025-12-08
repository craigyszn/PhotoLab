package com.example.oct28.finalproject.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

import com.example.oct28.finalproject.entity.PortfolioEntity;
import com.example.oct28.finalproject.entity.PhotographerEntity;
import com.example.oct28.finalproject.repository.PortfolioRepository;
import com.example.oct28.finalproject.repository.PhotographerRepository;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioRepository portfolioRepo;

    @Autowired
    private PhotographerRepository photographerRepo;

    public List<PortfolioEntity> getAll() { return portfolioRepo.findAll(); }

    public Optional<PortfolioEntity> getById(Long id) { return portfolioRepo.findById(id); }

    public PortfolioEntity create(Long photographerId, PortfolioEntity p) {
        PhotographerEntity photographer = photographerRepo.findById(photographerId)
                .orElseThrow(() -> new RuntimeException("Photographer not found"));
        p.setPhotographer(photographer);
        return portfolioRepo.save(p);
    }

    public PortfolioEntity update(Long id, Long photographerId, PortfolioEntity p) {
        p.setPortfolioId(id);
        PhotographerEntity photographer = photographerRepo.findById(photographerId)
                .orElseThrow(() -> new RuntimeException("Photographer not found"));
        p.setPhotographer(photographer);
        return portfolioRepo.save(p);
    }

    public void delete(Long id) { portfolioRepo.deleteById(id); }
}
