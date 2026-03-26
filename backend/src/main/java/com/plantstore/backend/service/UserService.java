package com.plantstore.backend.service;

import com.plantstore.backend.dto.user.UserRolesUpdateRequest;
import com.plantstore.backend.dto.user.UserSummaryResponse;

import java.util.List;

public interface UserService {
    List<UserSummaryResponse> findAll();
    UserSummaryResponse findMe(String email);
    UserSummaryResponse updateRoles(Long userId, UserRolesUpdateRequest request);
}
