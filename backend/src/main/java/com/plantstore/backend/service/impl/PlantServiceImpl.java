package com.plantstore.backend.service.impl;

import com.plantstore.backend.dto.plant.PlantRequest;
import com.plantstore.backend.dto.plant.PlantResponse;
import com.plantstore.backend.entity.Category;
import com.plantstore.backend.entity.Plant;
import com.plantstore.backend.entity.PlantImage;
import com.plantstore.backend.exception.BadRequestException;
import com.plantstore.backend.exception.ResourceNotFoundException;
import com.plantstore.backend.repository.CategoryRepository;
import com.plantstore.backend.repository.PlantRepository;
import com.plantstore.backend.service.FileStorageService;
import com.plantstore.backend.service.PlantService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlantServiceImpl implements PlantService {

    private final PlantRepository plantRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;

    @Override
    public List<PlantResponse> findPublicPlants() {
        return plantRepository.findAllByActiveTrueOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
    }

    @Override
    public List<PlantResponse> findAll() {
        return plantRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public PlantResponse findById(Long id) {
        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        return toResponse(plant);
    }

    @Override
    public PlantResponse findBySlug(String slug) {
        Plant plant = plantRepository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        return toResponse(plant);
    }

    @Override
    @Transactional
    public PlantResponse create(PlantRequest request) {
        if (plantRepository.existsPlantBySlug(request.getSlug())) {
            throw new BadRequestException("Ya existe un producto con ese slug.");
        }
        Plant plant = new Plant();
        apply(plant, request);
        attachPrimaryImage(plant, request);
        return toResponse(plantRepository.save(plant));
    }

    @Override
    @Transactional
    public PlantResponse update(Long id, PlantRequest request) {
        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        if (!plant.getSlug().equals(request.getSlug()) && plantRepository.existsPlantBySlug(request.getSlug())) {
            throw new BadRequestException("Ya existe un producto con ese slug.");
        }
        apply(plant, request);

        if (request.getImage() != null && !request.getImage().isEmpty()) {
            plant.getImages().forEach(image -> fileStorageService.deleteIfExists(image.getFileUrl()));
            plant.getImages().clear();
            attachPrimaryImage(plant, request);
        }

        return toResponse(plantRepository.save(plant));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        plant.getImages().forEach(image -> fileStorageService.deleteIfExists(image.getFileUrl()));
        plantRepository.delete(plant);
    }

    private void apply(Plant plant, PlantRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));

        plant.setName(request.getName());
        plant.setSlug(request.getSlug());
        plant.setShortDescription(request.getShortDescription());
        plant.setDescription(request.getDescription());
        plant.setPrice(request.getPrice());
        plant.setStock(request.getStock());
        plant.setBotanicalName(request.getBotanicalName());
        plant.setSizeLabel(request.getSizeLabel());
        plant.setFeatured(request.isFeatured());
        plant.setActive(request.isActive());
        plant.setCategory(category);
    }

    private void attachPrimaryImage(Plant plant, PlantRequest request) {
        String fileUrl = fileStorageService.storePlantImage(request.getImage());
        if (fileUrl == null) {
            return;
        }
        PlantImage image = new PlantImage();
        image.setFileName(request.getImage().getOriginalFilename());
        image.setFileUrl(fileUrl);
        image.setPrimaryImage(true);
        image.setPlant(plant);
        plant.getImages().add(image);
    }

    private PlantResponse toResponse(Plant plant) {
        String imageUrl = plant.getImages().stream()
                .filter(PlantImage::isPrimaryImage)
                .findFirst()
                .map(PlantImage::getFileUrl)
                .orElse(null);

        return new PlantResponse(
                plant.getId(),
                plant.getName(),
                plant.getSlug(),
                plant.getShortDescription(),
                plant.getDescription(),
                plant.getPrice(),
                plant.getStock(),
                plant.getBotanicalName(),
                plant.getSizeLabel(),
                plant.isFeatured(),
                plant.isActive(),
                plant.getCategory().getId(),
                plant.getCategory().getName(),
                imageUrl
        );
    }
}
