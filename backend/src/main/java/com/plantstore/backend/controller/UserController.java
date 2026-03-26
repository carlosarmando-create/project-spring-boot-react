package com.plantstore.backend.controller;

import com.plantstore.backend.dto.user.UserRolesUpdateRequest;
import com.plantstore.backend.dto.user.UserSummaryResponse;
import com.plantstore.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserSummaryResponse findMe(Authentication authentication) {
        return userService.findMe(authentication.getName());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserSummaryResponse> findAll() {
        return userService.findAll();
    }

    @PutMapping("/{id}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public UserSummaryResponse updateRoles(@PathVariable Long id, @Valid @RequestBody UserRolesUpdateRequest request) {
        return userService.updateRoles(id, request);
    }
}
