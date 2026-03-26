package com.plantstore.backend.controller;

import com.plantstore.backend.dto.plant.PlantRequest;
import com.plantstore.backend.dto.plant.PlantResponse;
import com.plantstore.backend.service.PlantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/plants")
@RequiredArgsConstructor
public class PlantController {

    private final PlantService plantService;

    @GetMapping
    public List<PlantResponse> findPublicPlants() {
        return plantService.findPublicPlants();
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public List<PlantResponse> findAll() {
        return plantService.findAll();
    }

    @GetMapping("/slug/{slug}")
    public PlantResponse findBySlug(@PathVariable String slug) {
        return plantService.findBySlug(slug);
    }

    @GetMapping("/{id}")
    public PlantResponse findById(@PathVariable Long id) {
        return plantService.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public PlantResponse create(@ModelAttribute PlantRequest request) {
        return plantService.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public PlantResponse update(@PathVariable Long id, @ModelAttribute PlantRequest request) {
        return plantService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        plantService.delete(id);
    }
}
