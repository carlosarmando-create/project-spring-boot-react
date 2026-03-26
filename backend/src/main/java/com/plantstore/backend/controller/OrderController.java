package com.plantstore.backend.controller;

import com.plantstore.backend.dto.order.OrderRequest;
import com.plantstore.backend.dto.order.OrderResponse;
import com.plantstore.backend.dto.order.OrderStatusUpdateRequest;
import com.plantstore.backend.exception.ResourceNotFoundException;
import com.plantstore.backend.repository.UserRepository;
import com.plantstore.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse create(Authentication authentication, @Valid @RequestBody OrderRequest request) {
        Long userId = userRepository.findByEmail(authentication.getName().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"))
                .getId();
        return orderService.create(userId, request);
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public List<OrderResponse> findMine(Authentication authentication) {
        Long userId = userRepository.findByEmail(authentication.getName().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"))
                .getId();
        return orderService.findMine(userId);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderResponse> findAll() {
        return orderService.findAll();
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public OrderResponse updateStatus(@PathVariable Long id, @Valid @RequestBody OrderStatusUpdateRequest request) {
        return orderService.updateStatus(id, request.status());
    }
}
