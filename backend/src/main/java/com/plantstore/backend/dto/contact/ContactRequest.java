package com.plantstore.backend.dto.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @NotBlank @Size(max = 120) String fullName,
        @Email @NotBlank String email,
        @Size(max = 30) String phone,
        @NotBlank @Size(max = 140) String subject,
        @NotBlank @Size(max = 2000) String message
) {
}
