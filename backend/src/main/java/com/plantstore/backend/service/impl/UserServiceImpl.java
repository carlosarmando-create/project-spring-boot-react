package com.plantstore.backend.service.impl;

import com.plantstore.backend.dto.user.UserRolesUpdateRequest;
import com.plantstore.backend.dto.user.UserSummaryResponse;
import com.plantstore.backend.entity.Role;
import com.plantstore.backend.entity.User;
import com.plantstore.backend.enums.RoleName;
import com.plantstore.backend.exception.ResourceNotFoundException;
import com.plantstore.backend.repository.RoleRepository;
import com.plantstore.backend.repository.UserRepository;
import com.plantstore.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public java.util.List<UserSummaryResponse> findAll() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public UserSummaryResponse findMe(String email) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return toResponse(user);
    }

    @Override
    @Transactional
    public UserSummaryResponse updateRoles(Long userId, UserRolesUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Set<Role> roles = request.roles().stream()
                .map(roleName -> {
                    String upperRoleName = roleName.toUpperCase();
                    String normalized = upperRoleName.startsWith("ROLE_")
                            ? upperRoleName
                            : "ROLE_" + upperRoleName;
                    return roleRepository.findByName(RoleName.valueOf(normalized))
                            .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado: " + normalized));
                })
                .collect(Collectors.toSet());

        user.setRoles(roles);
        return toResponse(userRepository.save(user));
    }

    private UserSummaryResponse toResponse(User user) {
        return new UserSummaryResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.isEnabled(),
                user.getRoles().stream().map(role -> role.getName().name()).collect(Collectors.toSet())
        );
    }
}
