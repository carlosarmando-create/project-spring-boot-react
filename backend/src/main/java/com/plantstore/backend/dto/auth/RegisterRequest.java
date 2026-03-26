package com.plantstore.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record RegisterRequest(
        @NotBlank @Size(max = 120) String fullName,
        @Email @NotBlank String email,
        @NotBlank @Size(min = 8, max = 120) String password,
        @Size(max = 30) String phone,
        Set<String> roles
) {
}
