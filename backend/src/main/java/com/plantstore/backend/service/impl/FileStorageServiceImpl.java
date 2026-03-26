package com.plantstore.backend.service.impl;

import com.plantstore.backend.exception.BadRequestException;
import com.plantstore.backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final Path uploadPath;

    public FileStorageServiceImpl(@Value("${app.upload.dir}") String uploadDir) {
        this.uploadPath = Paths.get(uploadDir, "plants").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadPath);
        } catch (IOException exception) {
            throw new IllegalStateException("No se pudo crear el directorio de subida", exception);
        }
    }

    @Override
    public String storePlantImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String sanitizedExtension = extension == null ? "jpg" : extension.toLowerCase();
        if (!sanitizedExtension.matches("jpg|jpeg|png|webp")) {
            throw new BadRequestException("Solo se permiten imágenes jpg, jpeg, png o webp");
        }

        String fileName = UUID.randomUUID() + "." + sanitizedExtension;
        Path target = uploadPath.resolve(fileName);

        try {
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/plants/" + fileName;
        } catch (IOException exception) {
            throw new IllegalStateException("No se pudo guardar la imagen", exception);
        }
    }

    @Override
    public void deleteIfExists(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) {
            return;
        }

        String fileName = fileUrl.replace("/uploads/plants/", "");
        try {
            Files.deleteIfExists(uploadPath.resolve(fileName));
        } catch (IOException ignored) {
        }
    }
}
