package com.plantstore.backend.service;

import com.plantstore.backend.dto.order.OrderRequest;
import com.plantstore.backend.dto.order.OrderResponse;
import com.plantstore.backend.enums.OrderStatus;

import java.util.List;

public interface OrderService {
    OrderResponse create(Long userId, OrderRequest request);
    List<OrderResponse> findMine(Long userId);
    List<OrderResponse> findAll();
    OrderResponse updateStatus(Long orderId, OrderStatus status);
}
