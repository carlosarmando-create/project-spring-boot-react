package com.plantstore.backend.repository;

import com.plantstore.backend.entity.Plant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlantRepository extends JpaRepository<Plant, Long> {
    List<Plant> findAllByActiveTrueOrderByCreatedAtDesc();
    Optional<Plant> findBySlug(String slug);
    Optional<Plant> findBySlugAndActiveTrue(String slug);
}
