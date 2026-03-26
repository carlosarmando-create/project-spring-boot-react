package com.plantstore.backend.dto.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        String status,
        BigDecimal totalAmount,
        String customerName,
        String customerEmail,
        String customerPhone,
        String shippingAddress,
        String paymentMethod,
        String notes,
        LocalDateTime createdAt,
        List<OrderItemResponse> items
) {
}
