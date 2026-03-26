package com.plantstore.backend.repository;

import com.plantstore.backend.entity.Role;
import com.plantstore.backend.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
