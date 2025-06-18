package com.innosync.service;

import com.innosync.dto.ProfileRequest;
import com.innosync.dto.ProfileResponse;
import com.innosync.model.Profile;
import com.innosync.model.User;
import com.innosync.repository.ProfileRepository;
import com.innosync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    public ProfileResponse createOrUpdateProfile(String email, ProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Profile profile = profileRepository.findByUser(user).orElse(new Profile());
        profile.setUser(user);
        profile.setDesiredPosition(request.getDesiredPosition());
        profile.setTechStack(request.getTechStack());
        profile.setLevel(request.getLevel());
        profile.setGithubLink(request.getGithubLink());
        profile.setLinkedinLink(request.getLinkedinLink());
        profile.setBio(request.getBio());

        profileRepository.save(profile);

        ProfileResponse response = new ProfileResponse();
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setDesiredPosition(profile.getDesiredPosition());
        response.setTechStack(profile.getTechStack());
        response.setLevel(profile.getLevel());
        response.setGithubLink(profile.getGithubLink());
        response.setLinkedinLink(profile.getLinkedinLink());
        response.setBio(profile.getBio());

        return response;
    }

    public ProfileResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Profile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        ProfileResponse response = new ProfileResponse();
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setDesiredPosition(profile.getDesiredPosition());
        response.setTechStack(profile.getTechStack());
        response.setLevel(profile.getLevel());
        response.setGithubLink(profile.getGithubLink());
        response.setLinkedinLink(profile.getLinkedinLink());
        response.setBio(profile.getBio());

        return response;
    }
}
