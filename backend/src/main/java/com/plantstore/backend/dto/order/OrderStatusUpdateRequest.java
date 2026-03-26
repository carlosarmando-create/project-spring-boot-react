package com.plantstore.backend.dto.order;

import com.plantstore.backend.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record OrderStatusUpdateRequest(@NotNull OrderStatus status) {
}
