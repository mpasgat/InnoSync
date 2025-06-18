package com.innosync.controller;

import com.innosync.dto.ProfileRequest;
import com.innosync.dto.ProfileResponse;
import com.innosync.model.Profile;
import com.innosync.model.User;
import com.innosync.repository.ProfileRepository;
import com.innosync.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<?> createProfile(@AuthenticationPrincipal UserDetails userDetails,
                                           @RequestBody ProfileRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(userDetails.getUsername());
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().body("User not found");

        if (profileRepository.findByUser(userOpt.get()).isPresent()) {
            return ResponseEntity.badRequest().body("Profile already exists");
        }

        User user = userOpt.get();
        Profile profile = new Profile();
        profile.setUser(user);
        profile.setTelegram(request.getTelegram());
        profile.setGithub(request.getGithub());
        profile.setBio(request.getBio());
        profile.setPosition(request.getPosition());
        profile.setEducation(request.getEducation());
        profile.setExpertise(request.getExpertise());
        profile.setExpertiseLevel(request.getExpertiseLevel());
        profile.setResume(request.getResume());

        return ResponseEntity.ok(profileRepository.save(profile));
    }

    @PutMapping
    @Transactional
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                           @RequestBody ProfileRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(userDetails.getUsername());
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().body("User not found");

        Optional<Profile> profileOpt = profileRepository.findByUser(userOpt.get());
        if (profileOpt.isEmpty()) return ResponseEntity.badRequest().body("Profile not found");

        Profile profile = profileOpt.get();
        profile.setTelegram(request.getTelegram());
        profile.setGithub(request.getGithub());
        profile.setBio(request.getBio());
        profile.setPosition(request.getPosition());
        profile.setEducation(request.getEducation());
        profile.setExpertise(request.getExpertise());
        profile.setExpertiseLevel(request.getExpertiseLevel());
        profile.setResume(request.getResume());

        return ResponseEntity.ok(profileRepository.save(profile));
    }

    @GetMapping
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> userOpt = userRepository.findByEmail(userDetails.getUsername());
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().body("User not found");

        return profileRepository.findByUser(userOpt.get())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
