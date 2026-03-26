package com.plantstore.backend.dto.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record OrderRequest(
        @NotBlank String customerName,
        @NotBlank String customerEmail,
        @NotBlank String customerPhone,
        @NotBlank String shippingAddress,
        @NotBlank String paymentMethod,
        String notes,
        @NotEmpty List<OrderItemRequest> items
) {
}
