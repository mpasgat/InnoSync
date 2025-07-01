package com.innosync.repository;

import com.innosync.model.Project;
import com.innosync.model.ProjectType;
import com.innosync.model.TeamSize;
import com.innosync.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@Import(com.innosync.config.TestContainersConfig.class)
class ProjectRepositoryIntegrationTest {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestEntityManager entityManager;

    private User recruiter1;
    private User recruiter2;

    @BeforeEach
    void setUp() {
        // Clean database
        projectRepository.deleteAll();
        userRepository.deleteAll();

        // Create test users
        recruiter1 = new User("recruiter1@example.com", "Recruiter One", "password123");
        recruiter2 = new User("recruiter2@example.com", "Recruiter Two", "password456");
        userRepository.save(recruiter1);
        userRepository.save(recruiter2);
    }

    @Test
    void save_WithValidProject_ShouldPersistProjectWithTimestamps() {
        // Given
        LocalDateTime beforeSave = LocalDateTime.now().minusSeconds(1);
        
        Project project = Project.builder()
                .title("Web Development Project")
                .description("Building a modern web application using React and Spring Boot")
                .recruiter(recruiter1)
                .projectType(ProjectType.FREELANCE)
                .teamSize(TeamSize.FourSix)
                .build();

        // When
        Project savedProject = projectRepository.save(project);
        LocalDateTime afterSave = LocalDateTime.now().plusSeconds(1);

        // Then
        assertThat(savedProject.getId()).isNotNull();
        assertThat(savedProject.getTitle()).isEqualTo("Web Development Project");
        assertThat(savedProject.getDescription()).isEqualTo("Building a modern web application using React and Spring Boot");
        assertThat(savedProject.getRecruiter().getId()).isEqualTo(recruiter1.getId());
        assertThat(savedProject.getProjectType()).isEqualTo(ProjectType.FREELANCE);
        assertThat(savedProject.getTeamSize()).isEqualTo(TeamSize.FourSix);
        
        // Verify timestamps were set by @PrePersist
        assertThat(savedProject.getCreatedAt()).isNotNull();
        assertThat(savedProject.getUpdatedAt()).isNotNull();
        assertThat(savedProject.getCreatedAt()).isAfter(beforeSave);
        assertThat(savedProject.getCreatedAt()).isBefore(afterSave);
        assertThat(savedProject.getUpdatedAt()).isEqualTo(savedProject.getCreatedAt());
    }

    @Test
    void save_WithAllProjectTypes_ShouldHandleAllEnumValues() {
        // Test each ProjectType enum value
        ProjectType[] projectTypes = {ProjectType.FREELANCE, ProjectType.RESEARCH, ProjectType.ACADEMIC, ProjectType.HACKATHON};
        TeamSize[] teamSizes = {TeamSize.OneThree, TeamSize.FourSix, TeamSize.SevenPlus};

        for (int i = 0; i < projectTypes.length; i++) {
            // Given
            Project project = Project.builder()
                    .title("Project " + i)
                    .description("Description " + i)
                    .recruiter(recruiter1)
                    .projectType(projectTypes[i])
                    .teamSize(teamSizes[i % teamSizes.length])
                    .build();

            // When
            Project savedProject = projectRepository.save(project);

            // Then
            assertThat(savedProject.getProjectType()).isEqualTo(projectTypes[i]);
            assertThat(savedProject.getTeamSize()).isEqualTo(teamSizes[i % teamSizes.length]);
        }
    }

    @Test
    void findByRecruiter_WithExistingProjects_ShouldReturnRecruiterProjects() {
        // Given
        Project project1 = Project.builder()
                .title("Mobile App")
                .description("iOS/Android app development")
                .recruiter(recruiter1)
                .projectType(ProjectType.FREELANCE)
                .teamSize(TeamSize.OneThree)
                .build();

        Project project2 = Project.builder()
                .title("Research Project")
                .description("AI/ML research initiative")
                .recruiter(recruiter1)
                .projectType(ProjectType.RESEARCH)
                .teamSize(TeamSize.FourSix)
                .build();

        Project project3 = Project.builder()
                .title("Other Project")
                .description("Project by different recruiter")
                .recruiter(recruiter2)
                .projectType(ProjectType.ACADEMIC)
                .teamSize(TeamSize.SevenPlus)
                .build();

        projectRepository.save(project1);
        projectRepository.save(project2);
        projectRepository.save(project3);

        // When
        List<Project> recruiter1Projects = projectRepository.findByRecruiter(recruiter1);
        List<Project> recruiter2Projects = projectRepository.findByRecruiter(recruiter2);

        // Then
        assertThat(recruiter1Projects).hasSize(2);
        assertThat(recruiter1Projects).extracting(Project::getTitle)
                .containsExactlyInAnyOrder("Mobile App", "Research Project");
        
        assertThat(recruiter2Projects).hasSize(1);
        assertThat(recruiter2Projects).extracting(Project::getTitle)
                .containsExactly("Other Project");
    }

    @Test
    void findByRecruiter_WithNonExistentRecruiter_ShouldReturnEmptyList() {
        // Given
        User nonExistentRecruiter = new User("nonexistent@example.com", "Non Existent", "password");
        userRepository.save(nonExistentRecruiter);

        // When
        List<Project> projects = projectRepository.findByRecruiter(nonExistentRecruiter);

        // Then
        assertThat(projects).isEmpty();
    }

    @Test
    void update_ExistingProject_ShouldUpdateTimestamp() throws InterruptedException {
        // Given
        Project project = Project.builder()
                .title("Original Title")
                .description("Original description")
                .recruiter(recruiter1)
                .projectType(ProjectType.HACKATHON)
                .teamSize(TeamSize.OneThree)
                .build();
        Project savedProject = projectRepository.save(project);
        LocalDateTime originalCreatedAt = savedProject.getCreatedAt();
        LocalDateTime originalUpdatedAt = savedProject.getUpdatedAt();

        // Wait a bit to ensure timestamp difference
        Thread.sleep(100); // Increase sleep time

        // When
        savedProject.setTitle("Updated Title");
        savedProject.setDescription("Updated description");
        savedProject.setProjectType(ProjectType.ACADEMIC);
        Project updatedProject = projectRepository.save(savedProject);
        entityManager.flush(); // Force flush to trigger @PreUpdate

        // Then
        assertThat(updatedProject.getTitle()).isEqualTo("Updated Title");
        assertThat(updatedProject.getDescription()).isEqualTo("Updated description");
        assertThat(updatedProject.getProjectType()).isEqualTo(ProjectType.ACADEMIC);
        assertThat(updatedProject.getTeamSize()).isEqualTo(TeamSize.OneThree); // Unchanged
        
        // Verify timestamps
        assertThat(updatedProject.getCreatedAt()).isEqualTo(originalCreatedAt); // Should not change
        assertThat(updatedProject.getUpdatedAt()).isAfter(originalUpdatedAt); // Should be updated by @PreUpdate
    }

    @Test
    void findById_WithExistingProject_ShouldReturnProjectWithRecruiter() {
        // Given
        Project project = Project.builder()
                .title("Database Project")
                .description("Database design and optimization")
                .recruiter(recruiter1)
                .projectType(ProjectType.RESEARCH)
                .teamSize(TeamSize.FourSix)
                .build();
        Project savedProject = projectRepository.save(project);

        // When
        Optional<Project> result = projectRepository.findById(savedProject.getId());

        // Then
        assertThat(result).isPresent();
        Project foundProject = result.get();
        assertThat(foundProject.getTitle()).isEqualTo("Database Project");
        assertThat(foundProject.getRecruiter()).isNotNull();
        assertThat(foundProject.getRecruiter().getEmail()).isEqualTo("recruiter1@example.com");
        assertThat(foundProject.getRecruiter().getFullName()).isEqualTo("Recruiter One");
    }

    @Test
    void delete_ExistingProject_ShouldRemoveFromDatabase() {
        // Given
        Project project = Project.builder()
                .title("Temporary Project")
                .description("This project will be deleted")
                .recruiter(recruiter1)
                .projectType(ProjectType.FREELANCE)
                .teamSize(TeamSize.OneThree)
                .build();
        Project savedProject = projectRepository.save(project);
        Long projectId = savedProject.getId();

        // When
        projectRepository.deleteById(projectId);

        // Then
        Optional<Project> result = projectRepository.findById(projectId);
        assertThat(result).isEmpty();
        
        // Verify recruiter still exists (should not cascade delete)
        Optional<User> recruiterResult = userRepository.findById(recruiter1.getId());
        assertThat(recruiterResult).isPresent();
    }

    @Test
    void findAll_WithMultipleProjectsAndRecruiters_ShouldReturnAllProjects() {
        // Given
        projectRepository.save(Project.builder()
                .title("Project A")
                .description("Description A")
                .recruiter(recruiter1)
                .projectType(ProjectType.FREELANCE)
                .teamSize(TeamSize.OneThree)
                .build());

        projectRepository.save(Project.builder()
                .title("Project B")
                .description("Description B")
                .recruiter(recruiter2)
                .projectType(ProjectType.ACADEMIC)
                .teamSize(TeamSize.FourSix)
                .build());

        projectRepository.save(Project.builder()
                .title("Project C")
                .description("Description C")
                .recruiter(recruiter1)
                .projectType(ProjectType.HACKATHON)
                .teamSize(TeamSize.SevenPlus)
                .build());

        // When
        List<Project> allProjects = projectRepository.findAll();

        // Then
        assertThat(allProjects).hasSize(3);
        assertThat(allProjects).extracting(Project::getTitle)
                .containsExactlyInAnyOrder("Project A", "Project B", "Project C");
    }
} 