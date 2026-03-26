package com.plantstore.backend.dto.user;

import java.util.Set;

public record UserSummaryResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        boolean enabled,
        Set<String> roles
) {
}
