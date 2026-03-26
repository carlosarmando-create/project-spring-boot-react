package com.plantstore.backend.controller;

import com.plantstore.backend.dto.contact.ContactRequest;
import com.plantstore.backend.dto.contact.ContactResponse;
import com.plantstore.backend.dto.contact.ContactStatusRequest;
import com.plantstore.backend.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
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
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactResponse create(@Valid @RequestBody ContactRequest request) {
        return contactService.create(request);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<ContactResponse> findAll() {
        return contactService.findAll();
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ContactResponse updateStatus(@PathVariable Long id, @Valid @RequestBody ContactStatusRequest request) {
        return contactService.updateStatus(id, request.status());
    }
}
