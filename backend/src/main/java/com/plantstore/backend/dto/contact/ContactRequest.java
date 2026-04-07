package com.plantstore.backend.dto.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @NotBlank(message = "El nombre completo es obligatorio.")
        @Size(max = 120, message = "El nombre completo no puede superar los 120 caracteres.")
        String fullName,
        @NotBlank(message = "El correo electrónico es obligatorio.")
        @Email(message = "Ingresa un correo electrónico válido.")
        String email,
        @Size(max = 30, message = "El teléfono no puede superar los 30 caracteres.")
        String phone,
        @NotBlank(message = "El asunto es obligatorio.")
        @Size(max = 140, message = "El asunto no puede superar los 140 caracteres.")
        String subject,
        @NotBlank(message = "El mensaje es obligatorio.")
        @Size(max = 2000, message = "El mensaje no puede superar los 2000 caracteres.")
        String message
) {
}
