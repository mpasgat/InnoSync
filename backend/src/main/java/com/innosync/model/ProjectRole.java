package com.innosync.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "project_role")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    private String roleName;

    @Enumerated(EnumType.STRING)
    private ExpertiseLevel expertiseLevel;

    private String technologies;
}
