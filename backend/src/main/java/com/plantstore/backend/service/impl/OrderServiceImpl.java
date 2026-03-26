package com.plantstore.backend.service.impl;

import com.plantstore.backend.dto.order.OrderItemRequest;
import com.plantstore.backend.dto.order.OrderItemResponse;
import com.plantstore.backend.dto.order.OrderRequest;
import com.plantstore.backend.dto.order.OrderResponse;
import com.plantstore.backend.entity.Order;
import com.plantstore.backend.entity.OrderItem;
import com.plantstore.backend.entity.Plant;
import com.plantstore.backend.entity.User;
import com.plantstore.backend.enums.OrderStatus;
import com.plantstore.backend.exception.BadRequestException;
import com.plantstore.backend.exception.ResourceNotFoundException;
import com.plantstore.backend.repository.OrderRepository;
import com.plantstore.backend.repository.PlantRepository;
import com.plantstore.backend.repository.UserRepository;
import com.plantstore.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final PlantRepository plantRepository;

    @Override
    @Transactional
    public OrderResponse create(Long userId, OrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Order order = new Order();
        order.setUser(user);
        order.setCustomerName(request.customerName());
        order.setCustomerEmail(request.customerEmail());
        order.setCustomerPhone(request.customerPhone());
        order.setShippingAddress(request.shippingAddress());
        order.setPaymentMethod(request.paymentMethod());
        order.setNotes(request.notes());
        order.setStatus(OrderStatus.PENDING);

        BigDecimal total = BigDecimal.ZERO;
        for (OrderItemRequest itemRequest : request.items()) {
            Plant plant = plantRepository.findById(itemRequest.plantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + itemRequest.plantId()));

            if (plant.getStock() < itemRequest.quantity()) {
                throw new BadRequestException("Stock insuficiente para " + plant.getName());
            }

            BigDecimal subtotal = plant.getPrice().multiply(BigDecimal.valueOf(itemRequest.quantity()));
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setPlant(plant);
            item.setPlantName(plant.getName());
            item.setQuantity(itemRequest.quantity());
            item.setUnitPrice(plant.getPrice());
            item.setSubtotal(subtotal);
            order.getItems().add(item);

            plant.setStock(plant.getStock() - itemRequest.quantity());
            total = total.add(subtotal);
        }

        order.setTotalAmount(total);
        return toResponse(orderRepository.save(order));
    }

    @Override
    public List<OrderResponse> findMine(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(this::toResponse).toList();
    }

    @Override
    public List<OrderResponse> findAll() {
        return orderRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public OrderResponse updateStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));
        order.setStatus(status);
        return toResponse(orderRepository.save(order));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = new ArrayList<>();
        order.getItems().forEach(item -> items.add(new OrderItemResponse(
                item.getPlant().getId(),
                item.getPlantName(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getSubtotal()
        )));

        return new OrderResponse(
                order.getId(),
                order.getStatus().name(),
                order.getTotalAmount(),
                order.getCustomerName(),
                order.getCustomerEmail(),
                order.getCustomerPhone(),
                order.getShippingAddress(),
                order.getPaymentMethod(),
                order.getNotes(),
                order.getCreatedAt(),
                items
        );
    }
}
