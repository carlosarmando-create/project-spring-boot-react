package com.plantstore.backend.service;

import com.plantstore.backend.dto.contact.ContactRequest;
import com.plantstore.backend.dto.contact.ContactResponse;
import com.plantstore.backend.enums.ContactStatus;

import java.util.List;

public interface ContactService {
    ContactResponse create(ContactRequest request);
    List<ContactResponse> findAll();
    ContactResponse updateStatus(Long id, ContactStatus status);
}
