package com.innosync.controller;

import com.innosync.dto.ProfileRequest;
import com.innosync.dto.ProfileResponse;
import com.innosync.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @PostMapping
    public ProfileResponse createOrUpdateProfile(@RequestBody ProfileRequest request, Authentication auth) {
        String email = auth.getName();
        return profileService.createOrUpdateProfile(email, request);
    }

    @GetMapping("/me")
    public ProfileResponse getMyProfile(Authentication auth) {
        String email = auth.getName();
        return profileService.getMyProfile(email);
    }
}
