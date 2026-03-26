package com.plantstore.backend.service;

import com.plantstore.backend.dto.plant.PlantRequest;
import com.plantstore.backend.dto.plant.PlantResponse;

import java.util.List;

public interface PlantService {
    List<PlantResponse> findPublicPlants();
    List<PlantResponse> findAll();
    PlantResponse findById(Long id);
    PlantResponse findBySlug(String slug);
    PlantResponse create(PlantRequest request);
    PlantResponse update(Long id, PlantRequest request);
    void delete(Long id);
}
