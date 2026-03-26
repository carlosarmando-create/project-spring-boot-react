package com.plantstore.backend.service.impl;

import com.plantstore.backend.dto.contact.ContactRequest;
import com.plantstore.backend.dto.contact.ContactResponse;
import com.plantstore.backend.entity.ContactMessage;
import com.plantstore.backend.enums.ContactStatus;
import com.plantstore.backend.exception.ResourceNotFoundException;
import com.plantstore.backend.repository.ContactMessageRepository;
import com.plantstore.backend.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactMessageRepository contactMessageRepository;

    @Override
    public ContactResponse create(ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.setFullName(request.fullName());
        message.setEmail(request.email());
        message.setPhone(request.phone());
        message.setSubject(request.subject());
        message.setMessage(request.message());
        message.setStatus(ContactStatus.NEW);
        return toResponse(contactMessageRepository.save(message));
    }

    @Override
    public List<ContactResponse> findAll() {
        return contactMessageRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public ContactResponse updateStatus(Long id, ContactStatus status) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mensaje no encontrado"));
        message.setStatus(status);
        return toResponse(contactMessageRepository.save(message));
    }

    private ContactResponse toResponse(ContactMessage message) {
        return new ContactResponse(
                message.getId(),
                message.getFullName(),
                message.getEmail(),
                message.getPhone(),
                message.getSubject(),
                message.getMessage(),
                message.getStatus().name(),
                message.getCreatedAt()
        );
    }
}
