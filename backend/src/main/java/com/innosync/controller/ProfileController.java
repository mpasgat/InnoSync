package com.innosync.controller;

import com.innosync.dto.profile.ProfileRequest;
import com.innosync.dto.profile.ProfileResponse;
import com.innosync.model.Profile;
import com.innosync.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.net.MalformedURLException;

@RestController
@RequestMapping("/api/profile")
@Tag(name = "Profile API", description = "API for user profile") // Swagger annotation
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @PostMapping
    @Operation(summary = "Create user profile")
    public ProfileResponse createOrUpdateProfile(@RequestBody ProfileRequest request, Authentication auth) {
        String email = auth.getName();
        return profileService.createOrUpdateProfile(email, request);
    }

    @PutMapping
    @Operation(summary = "Update user profile")
    public ProfileResponse updateProfile(@RequestBody ProfileRequest request, Authentication auth) {
        String email = auth.getName();
        return profileService.createOrUpdateProfile(email, request);
    }

    @GetMapping("/me")
    @Operation(summary = "Show personal profile")
    public ProfileResponse getMyProfile(Authentication auth) {
        String email = auth.getName();
        return profileService.getMyProfile(email);
    }


    @PostMapping("/upload-resume")
    @Operation(summary = "Upload user resume (CV)")
    public ResponseEntity<String> uploadResume(@RequestParam("file") MultipartFile file,
                                               Authentication auth) {
        String email = auth.getName();
        try {
            Profile profile;
            try {
                profile = profileService.getProfileByEmail(email);
            } catch (RuntimeException ex) {
                profile = new Profile();
                profile.setUser(profileService.getUserByEmail(email));
            }

            Path backendDir = Paths.get(System.getProperty("user.dir"));       // e.g. .../InnoSync/backend
            Path projectRoot = backendDir.getParent();                        // .../InnoSync
            Path uploadDir   = projectRoot.resolve("uploads").resolve("resumes");
            Files.createDirectories(uploadDir);

            String original = Paths.get(file.getOriginalFilename()).getFileName().toString();
            String filename = "cv_user_" + profile.getUser().getId() + "_" + original;
            Path target = uploadDir.resolve(filename);

            file.transferTo(target.toFile());

            profile.setResume("uploads/resumes/" + filename);
            profileService.save(profile);

            return ResponseEntity.ok("Resume uploaded successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(500)
                    .body("Failed to upload resume: " + e.getMessage());
        }
    }

    @GetMapping("/{profileId}/resume")
    @Operation(summary = "Get a user's resume file")
    public ResponseEntity<Resource> downloadResume(@PathVariable Long profileId) {
        try {
            Profile profile = profileService.getProfileById(profileId);
            String resumePath = profile.getResume();
            if (resumePath == null || resumePath.isBlank()) {
                return ResponseEntity.notFound().build();
            }

            Path backendDir  = Paths.get(System.getProperty("user.dir")); // InnoSync/backend
            Path projectRoot = backendDir.getParent();                    // InnoSync
            Path filePath    = projectRoot.resolve(resumePath);

            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String filename = filePath.getFileName().toString();
            MediaType mediaType = filename.toLowerCase().endsWith(".pdf")
                    ? MediaType.APPLICATION_PDF
                    : MediaType.APPLICATION_OCTET_STREAM;

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + filename + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            // invalid path
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/upload-profile-picture")
    @Operation(summary = "Upload user profile picture")
    public ResponseEntity<String> uploadProfilePicture(
            @RequestParam("file") MultipartFile file,
            Authentication auth) {
        String email = auth.getName();
        try {
            Profile profile;
            try {
                profile = profileService.getProfileByEmail(email);
            } catch (RuntimeException ex) {
                profile = new Profile();
                profile.setUser(profileService.getUserByEmail(email));
            }

            Path backendDir  = Paths.get(System.getProperty("user.dir"));
            Path projectRoot = backendDir.getParent();
            Path uploadDir   = projectRoot.resolve("uploads").resolve("profile-pics");
            Files.createDirectories(uploadDir);

            String original = Paths.get(file.getOriginalFilename()).getFileName().toString();
            String filename = "pic_user_" + profile.getUser().getId() + "_" + original;
            Path target   = uploadDir.resolve(filename);

            file.transferTo(target);

            profile.setProfilePicture("uploads/profile-pics/" + filename);
            profileService.save(profile);

            return ResponseEntity.ok("Profile picture uploaded successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Failed to upload picture: " + e.getMessage());
        }
    }

    @GetMapping("/{profileId}/picture")
    @Operation(summary = "Get a user's profile picture")
    public ResponseEntity<Resource> downloadProfilePicture(@PathVariable Long profileId) {
        try {
            Profile profile = profileService.getProfileById(profileId);
            String picPath = profile.getProfilePicture();
            if (picPath == null || picPath.isBlank()) {
                return ResponseEntity.notFound().build();
            }

            Path filePath = resolveFromProjectRoot(picPath);
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String filename = filePath.getFileName().toString();
            String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
            MediaType mediaType;
            switch (ext) {
                case "png":  mediaType = MediaType.IMAGE_PNG;  break;
                case "jpg":
                case "jpeg": mediaType = MediaType.IMAGE_JPEG; break;
                case "gif":  mediaType = MediaType.IMAGE_GIF;  break;
                default:     mediaType = MediaType.APPLICATION_OCTET_STREAM;
            }

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.status(500).build();
        }
    }

    private Path resolveFromProjectRoot(String relativePath) {
        Path backendDir  = Paths.get(System.getProperty("user.dir")); // …/InnoSync/backend
        Path projectRoot = backendDir.getParent();                    // …/InnoSync
        return projectRoot.resolve(relativePath);
    }
}
