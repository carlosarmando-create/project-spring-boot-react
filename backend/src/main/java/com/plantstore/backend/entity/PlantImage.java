package com.plantstore.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "plant_images")
public class PlantImage extends BaseEntity {

    @Column(nullable = false, length = 160)
    private String fileName;

    @Column(nullable = false, length = 255)
    private String fileUrl;

    @Column(nullable = false)
    private boolean primaryImage = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plant_id", nullable = false)
    private Plant plant;
}
