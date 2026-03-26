package com.plantstore.backend.dto.plant;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Getter
@Setter
public class PlantRequest {
    private String name;
    private String slug;
    private String shortDescription;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String botanicalName;
    private String sizeLabel;
    private boolean featured;
    private boolean active;
    private Long categoryId;
    private MultipartFile image;
}
