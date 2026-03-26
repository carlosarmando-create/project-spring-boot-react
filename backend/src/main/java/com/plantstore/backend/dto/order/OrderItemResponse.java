package com.plantstore.backend.dto.order;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long plantId,
        String plantName,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal subtotal
) {
}
