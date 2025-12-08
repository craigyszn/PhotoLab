package com.example.oct28.finalproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.oct28.finalproject.entity.PortfolioEntity;

public interface PortfolioRepository extends JpaRepository<PortfolioEntity, Long> { }
