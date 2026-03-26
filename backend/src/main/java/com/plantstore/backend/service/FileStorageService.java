package com.plantstore.backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String storePlantImage(MultipartFile file);
    void deleteIfExists(String fileUrl);
}
