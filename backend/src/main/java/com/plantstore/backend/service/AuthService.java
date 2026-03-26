package com.plantstore.backend.service;

import com.plantstore.backend.dto.auth.AuthResponse;
import com.plantstore.backend.dto.auth.LoginRequest;
import com.plantstore.backend.dto.auth.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
