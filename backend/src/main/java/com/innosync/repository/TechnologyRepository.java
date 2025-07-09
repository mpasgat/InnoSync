package com.innosync.repository;

import com.innosync.model.Technology;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TechnologyRepository extends JpaRepository<Technology, Long> {
    static final Logger logger = LoggerFactory.getLogger(TechnologyRepository.class);

    Optional<Technology> findByName(String name);
    Optional<Technology> findByNameIgnoreCase(String techName);
}
