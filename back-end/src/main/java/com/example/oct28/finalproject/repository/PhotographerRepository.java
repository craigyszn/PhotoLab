package com.example.oct28.finalproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.oct28.finalproject.entity.PhotographerEntity;

public interface PhotographerRepository extends JpaRepository<PhotographerEntity, Long> { }
