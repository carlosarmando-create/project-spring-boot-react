package com.plantstore.backend.dto.contact;

import com.plantstore.backend.enums.ContactStatus;
import jakarta.validation.constraints.NotNull;

public record ContactStatusRequest(@NotNull ContactStatus status) {
}
