package com.plantstore.backend.dto.contact;

import java.time.LocalDateTime;

public record ContactResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String subject,
        String message,
        String status,
        LocalDateTime createdAt
) {
}
