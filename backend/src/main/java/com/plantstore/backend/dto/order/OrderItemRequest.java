package com.plantstore.backend.dto.order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record OrderItemRequest(
        @NotNull Long plantId,
        @NotNull @Min(1) Integer quantity
) {
}
