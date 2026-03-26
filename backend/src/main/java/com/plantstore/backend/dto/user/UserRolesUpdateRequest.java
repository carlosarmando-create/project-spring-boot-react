package com.plantstore.backend.dto.user;

import jakarta.validation.constraints.NotEmpty;

import java.util.Set;

public record UserRolesUpdateRequest(@NotEmpty Set<String> roles) {
}
