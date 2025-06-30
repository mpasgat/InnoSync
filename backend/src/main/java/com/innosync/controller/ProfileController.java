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
            // 1) get or create a minimal profile
            Profile profile;
            try {
                profile = profileService.getProfileByEmail(email);
            } catch (RuntimeException ex) {
                profile = new Profile();
                profile.setUser(profileService.getUserByEmail(email));
            }

            // 2) build the target directory: ../uploads/resumes
            Path backendDir = Paths.get(System.getProperty("user.dir"));       // e.g. .../InnoSync/backend
            Path projectRoot = backendDir.getParent();                        // .../InnoSync
            Path uploadDir   = projectRoot.resolve("uploads").resolve("resumes");
            Files.createDirectories(uploadDir);

            // 3) sanitize & build filename
            String original = Paths.get(file.getOriginalFilename()).getFileName().toString();
            String filename = "cv_user_" + profile.getUser().getId() + "_" + original;
            Path target = uploadDir.resolve(filename);

            // 4) save the file
            file.transferTo(target.toFile());

            // 5) persist the path (relative to InnoSync) in the DB
            //    here we store “uploads/resumes/…” so frontends can build URLs as needed
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
            // 1) load profile and get stored path (e.g. "uploads/resumes/…")
            Profile profile = profileService.getProfileById(profileId);
            String resumePath = profile.getResume();
            if (resumePath == null || resumePath.isBlank()) {
                return ResponseEntity.notFound().build();
            }

            // 2) build absolute path: go from backend → InnoSync → resumePath
            Path backendDir  = Paths.get(System.getProperty("user.dir")); // InnoSync/backend
            Path projectRoot = backendDir.getParent();                    // InnoSync
            Path filePath    = projectRoot.resolve(resumePath);

            // 3) create a Resource
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            // 4) determine content type (optional: can be smarter)
            String filename = filePath.getFileName().toString();
            MediaType mediaType = filename.toLowerCase().endsWith(".pdf")
                    ? MediaType.APPLICATION_PDF
                    : MediaType.APPLICATION_OCTET_STREAM;

            // 5) return with Content‑Disposition for attachment
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

}
