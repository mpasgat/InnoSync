package com.innosync.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String desiredPosition;
    private String techStack;
    private String level; // Entry, Junior, etc.
    private String githubLink;
    private String linkedinLink;
    private String bio;
}
