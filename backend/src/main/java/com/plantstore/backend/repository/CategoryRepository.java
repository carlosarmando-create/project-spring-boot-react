package com.plantstore.backend.repository;

import com.plantstore.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByName(String name);

    boolean existsBySlug(String slug);
}
