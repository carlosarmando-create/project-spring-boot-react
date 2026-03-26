package com.plantstore.backend.dto.plant;

import java.math.BigDecimal;

public record PlantResponse(
        Long id,
        String name,
        String slug,
        String shortDescription,
        String description,
        BigDecimal price,
        Integer stock,
        String botanicalName,
        String sizeLabel,
        boolean featured,
        boolean active,
        Long categoryId,
        String categoryName,
        String imageUrl
) {
}
