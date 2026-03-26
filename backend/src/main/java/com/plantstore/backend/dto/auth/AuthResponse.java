package com.plantstore.backend.dto.auth;

import java.util.Set;

public record AuthResponse(
        String token,
        String tokenType,
        Long userId,
        String fullName,
        String email,
        Set<String> roles
) {
}
