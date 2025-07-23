package com.innosync.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "project_team_member")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectTeamMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne
    @JoinColumn(name = "project_role_id", nullable = false)
    private ProjectRole projectRole;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "joined_at", nullable = false)
    private LocalDateTime joinedAt;

    @Column(name = "joined_via")
    @Enumerated(EnumType.STRING)
    private JoinMethod joinedVia;

    public enum JoinMethod {
        INVITATION,
        APPLICATION
    }

    @PrePersist
    protected void onCreate() {
        joinedAt = LocalDateTime.now();
    }
}