package com.innosync.repository;

import com.innosync.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@Import(com.innosync.config.TestContainersConfig.class)
class ProfileRepositoryIntegrationTest {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TechnologyRepository technologyRepository;

    private User user1;
    private User user2;
    private Technology java;
    private Technology python;
    private Technology react;
    private Technology spring;

    @BeforeEach
    void setUp() {
        // Clean database
        profileRepository.deleteAll();
        technologyRepository.deleteAll();
        userRepository.deleteAll();

        // Create test users
        user1 = new User("john.doe@example.com", "John Doe", "password123");
        user2 = new User("jane.smith@example.com", "Jane Smith", "password456");
        userRepository.saveAll(List.of(user1, user2));

        // Create test technologies
        java = new Technology("Java");
        python = new Technology("Python");
        react = new Technology("React");
        spring = new Technology("Spring Boot");
        technologyRepository.saveAll(List.of(java, python, react, spring));
    }

    @Test
    void save_WithValidProfile_ShouldPersistProfileWithAllFields() {
        // Given
        Profile profile = new Profile();
        profile.setUser(user1);
        profile.setTelegram("@johndoe");
        profile.setGithub("github.com/johndoe");
        profile.setBio("Experienced full-stack developer with 5+ years of experience");
        profile.setPosition("Senior Software Engineer");
        profile.setEducation(Education.BACHELOR);
        profile.setExpertise("Full-stack development, microservices, cloud architecture");
        profile.setExpertiseLevel(ExpertiseLevel.SENIOR);
        profile.setResume("/uploads/resumes/john_doe_resume.pdf");
        profile.setProfilePicture("/uploads/profiles/john_doe_avatar.jpg");
        profile.setTechnologies(List.of(java, spring, react));

        // When
        Profile savedProfile = profileRepository.save(profile);

        // Then
        assertThat(savedProfile.getId()).isNotNull();
        assertThat(savedProfile.getUser().getId()).isEqualTo(user1.getId());
        assertThat(savedProfile.getTelegram()).isEqualTo("@johndoe");
        assertThat(savedProfile.getGithub()).isEqualTo("github.com/johndoe");
        assertThat(savedProfile.getBio()).isEqualTo("Experienced full-stack developer with 5+ years of experience");
        assertThat(savedProfile.getPosition()).isEqualTo("Senior Software Engineer");
        assertThat(savedProfile.getEducation()).isEqualTo(Education.BACHELOR);
        assertThat(savedProfile.getExpertise()).isEqualTo("Full-stack development, microservices, cloud architecture");
        assertThat(savedProfile.getExpertiseLevel()).isEqualTo(ExpertiseLevel.SENIOR);
        assertThat(savedProfile.getResume()).isEqualTo("/uploads/resumes/john_doe_resume.pdf");
        assertThat(savedProfile.getProfilePicture()).isEqualTo("/uploads/profiles/john_doe_avatar.jpg");
        assertThat(savedProfile.getTechnologies()).hasSize(3);
        assertThat(savedProfile.getTechnologies()).extracting(Technology::getName)
                .containsExactlyInAnyOrder("Java", "Spring Boot", "React");
    }

    @Test
    void save_WithAllEducationLevels_ShouldHandleAllEnumValues() {
        // Test each Education enum value
        Education[] educationLevels = {Education.NO_DEGREE, Education.BACHELOR, Education.MASTER, Education.PHD};

        for (int i = 0; i < educationLevels.length; i++) {
            // Given - Create a new user for each iteration to avoid constraint violations
            User user = new User("test.education." + i + "@example.com", "Test User" + i, "password");
            User savedUser = userRepository.save(user);
            
            Profile profile = createBasicProfile(savedUser);
            profile.setEducation(educationLevels[i]);

            // When
            Profile savedProfile = profileRepository.save(profile);

            // Then
            assertThat(savedProfile.getEducation()).isEqualTo(educationLevels[i]);
        }
    }

    @Test
    void save_WithAllExpertiseLevels_ShouldHandleAllEnumValues() {
        // Test each ExpertiseLevel enum value
        ExpertiseLevel[] expertiseLevels = {
                ExpertiseLevel.ENTRY, ExpertiseLevel.JUNIOR, ExpertiseLevel.MID, 
                ExpertiseLevel.SENIOR, ExpertiseLevel.RESEARCHER
        };

        for (int i = 0; i < expertiseLevels.length; i++) {
            // Given - Create a new user for each iteration to avoid constraint violations
            User user = new User("test.expertise." + i + "@example.com", "Test User" + i, "password");
            User savedUser = userRepository.save(user);
            
            Profile profile = createBasicProfile(savedUser);
            profile.setExpertiseLevel(expertiseLevels[i]);

            // When
            Profile savedProfile = profileRepository.save(profile);

            // Then
            assertThat(savedProfile.getExpertiseLevel()).isEqualTo(expertiseLevels[i]);
        }
    }

    @Test
    void findByUser_WithExistingProfile_ShouldReturnProfile() {
        // Given
        Profile profile = createBasicProfile(user1);
        profileRepository.save(profile);

        // When
        Optional<Profile> result = profileRepository.findByUser(user1);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getUser().getId()).isEqualTo(user1.getId());
        assertThat(result.get().getUser().getEmail()).isEqualTo("john.doe@example.com");
    }

    @Test
    void findByUser_WithNonExistentProfile_ShouldReturnEmpty() {
        // When
        Optional<Profile> result = profileRepository.findByUser(user2);

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    void save_WithMultipleTechnologies_ShouldPersistManyToManyRelationship() {
        // Given
        Profile profile = createBasicProfile(user1);
        profile.setTechnologies(List.of(java, python, react, spring));

        // When
        Profile savedProfile = profileRepository.save(profile);

        // Then
        assertThat(savedProfile.getTechnologies()).hasSize(4);
        assertThat(savedProfile.getTechnologies()).extracting(Technology::getName)
                .containsExactlyInAnyOrder("Java", "Python", "React", "Spring Boot");

        // Verify technologies still exist independently
        assertThat(technologyRepository.findByName("Java")).isPresent();
        assertThat(technologyRepository.findByName("Python")).isPresent();
    }

    @Test
    void save_WithEmptyTechnologies_ShouldHandleEmptyList() {
        // Given
        Profile profile = createBasicProfile(user1);
        profile.setTechnologies(List.of()); // Empty list

        // When
        Profile savedProfile = profileRepository.save(profile);

        // Then
        assertThat(savedProfile.getTechnologies()).isEmpty();
    }

    @Test
    void update_ExistingProfile_ShouldUpdateAllFields() {
        // Given - Create a separate user to avoid constraint violations
        User user = new User("test.update@example.com", "Test Update", "password");
        User savedUser = userRepository.save(user);
        
        Profile profile = createBasicProfile(savedUser);
        profile.setTechnologies(new ArrayList<>(List.of(java))); // Use ArrayList to avoid UnsupportedOperation
        Profile savedProfile = profileRepository.save(profile);

        // When
        savedProfile.setBio("Updated bio with new experience");
        savedProfile.setPosition("Tech Lead");
        savedProfile.setEducation(Education.MASTER);
        savedProfile.setExpertiseLevel(ExpertiseLevel.SENIOR);
        savedProfile.setTechnologies(new ArrayList<>(List.of(java, python, spring))); // Use ArrayList
        Profile updatedProfile = profileRepository.save(savedProfile);

        // Then
        assertThat(updatedProfile.getBio()).isEqualTo("Updated bio with new experience");
        assertThat(updatedProfile.getPosition()).isEqualTo("Tech Lead");
        assertThat(updatedProfile.getEducation()).isEqualTo(Education.MASTER);
        assertThat(updatedProfile.getExpertiseLevel()).isEqualTo(ExpertiseLevel.SENIOR);
        assertThat(updatedProfile.getTechnologies()).hasSize(3);
        assertThat(updatedProfile.getTechnologies()).extracting(Technology::getName)
                .containsExactlyInAnyOrder("Java", "Python", "Spring Boot");
    }

    @Test
    void delete_ExistingProfile_ShouldRemoveProfileButKeepUserAndTechnologies() {
        // Given
        Profile profile = createBasicProfile(user1);
        profile.setTechnologies(List.of(java, python));
        Profile savedProfile = profileRepository.save(profile);
        Long profileId = savedProfile.getId();

        // When
        profileRepository.deleteById(profileId);

        // Then
        Optional<Profile> result = profileRepository.findById(profileId);
        assertThat(result).isEmpty();

        // Verify user still exists (no cascade delete)
        Optional<User> userResult = userRepository.findById(user1.getId());
        assertThat(userResult).isPresent();

        // Verify technologies still exist (no cascade delete)
        assertThat(technologyRepository.findByName("Java")).isPresent();
        assertThat(technologyRepository.findByName("Python")).isPresent();
    }

    @Test
    void save_WithLongBioAndExpertise_ShouldHandleLongTextFields() {
        // Given - Create a separate user to avoid constraint violations
        User user = new User("test.longtext@example.com", "Test LongText", "password");
        User savedUser = userRepository.save(user);
        
        String longBio = "This is a very long bio that describes the developer's extensive experience " +
                "in various technologies, projects, and achievements. ".repeat(10); // ~630 characters

        // Keep expertise within varchar(255) limit
        String longExpertise = "Full-stack development, microservices architecture, cloud computing, " +
                "DevOps practices, database design, API development"; // ~140 characters, safe for varchar(255)

        Profile profile = createBasicProfile(savedUser);
        profile.setBio(longBio);
        profile.setExpertise(longExpertise);

        // When
        Profile savedProfile = profileRepository.save(profile);

        // Then
        assertThat(savedProfile.getBio()).isEqualTo(longBio);
        assertThat(savedProfile.getExpertise()).isEqualTo(longExpertise);
        assertThat(savedProfile.getBio().length()).isGreaterThan(500);
    }

    @Test
    void findAll_WithMultipleProfiles_ShouldReturnAllProfilesWithRelationships() {
        // Given
        Profile profile1 = createBasicProfile(user1);
        profile1.setPosition("Senior Developer");
        profile1.setTechnologies(List.of(java, spring));

        Profile profile2 = createBasicProfile(user2);
        profile2.setPosition("Data Scientist");
        profile2.setTechnologies(List.of(python));

        profileRepository.saveAll(List.of(profile1, profile2));

        // When
        List<Profile> allProfiles = profileRepository.findAll();

        // Then
        assertThat(allProfiles).hasSize(2);
        
        for (Profile profile : allProfiles) {
            assertThat(profile.getUser()).isNotNull();
            assertThat(profile.getUser().getEmail()).isIn("john.doe@example.com", "jane.smith@example.com");
            assertThat(profile.getTechnologies()).isNotEmpty();
        }
    }

    @Test
    void save_WithUniqueUserConstraint_ShouldEnforceOneProfilePerUser() {
        // Given
        Profile profile1 = createBasicProfile(user1);
        profileRepository.save(profile1);

        Profile profile2 = createBasicProfile(user1); // Same user
        profile2.setBio("Different bio");

        // When & Then
        // This should fail due to unique constraint on user_id
        // The exact exception depends on the database, but it should fail
        try {
            profileRepository.save(profile2);
            profileRepository.flush(); // Force the constraint check
            // If we get here, the test should verify the behavior
            List<Profile> profiles = profileRepository.findAll();
            assertThat(profiles).hasSize(1); // Should still be only one profile
        } catch (Exception e) {
            // Expected: constraint violation exception
            assertThat(e.getMessage()).containsAnyOf("unique", "constraint", "duplicate");
        }
    }

    private Profile createBasicProfile(User user) {
        Profile profile = new Profile();
        profile.setUser(user);
        profile.setTelegram("@telegram");
        profile.setGithub("github.com/user");
        profile.setBio("Software developer with passion for technology");
        profile.setPosition("Software Developer");
        profile.setEducation(Education.BACHELOR);
        profile.setExpertise("Software development");
        profile.setExpertiseLevel(ExpertiseLevel.MID);
        profile.setResume("/uploads/resume.pdf");
        profile.setProfilePicture("/uploads/profile.jpg");
        return profile;
    }
} 