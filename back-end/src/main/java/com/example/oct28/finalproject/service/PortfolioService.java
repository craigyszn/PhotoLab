package com.example.oct28.finalproject.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;
import com.example.oct28.finalproject.entity.PortfolioEntity;
import com.example.oct28.finalproject.repository.PortfolioRepository;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioRepository repo;

    public List<PortfolioEntity> getAll() { return repo.findAll(); }
    public Optional<PortfolioEntity> getById(Long id) { return repo.findById(id); }
    public PortfolioEntity create(PortfolioEntity p) { return repo.save(p); }
    public PortfolioEntity update(Long id, PortfolioEntity p) { p.setPortfolioId(id); return repo.save(p); }
    public void delete(Long id) { repo.deleteById(id); }
}
