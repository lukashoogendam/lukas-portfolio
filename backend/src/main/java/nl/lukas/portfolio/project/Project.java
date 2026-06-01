package nl.lukas.portfolio.project;

import jakarta.persistence.*;
import lombok.*;
import nl.lukas.portfolio.skill.Skill;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String slug;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "short_description")
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 100)
    private ProjectCategory category;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private ProjectStatus status;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "repository_url")
    private String repositoryUrl;

    @Column(name = "course_name", length = 150)
    private String courseName;

    @Column(name = "document_url")
    private String documentUrl;

    @Column(columnDefinition = "TEXT")
    private String role;

    @Column(columnDefinition = "TEXT")
    private String highlights;

    @Column(columnDefinition = "TEXT")
    private String features;

    @Column(nullable = false)
    @Builder.Default
    private boolean highlighted = false;

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    private List<ProjectTranslation> translations = new ArrayList<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    @ToString.Exclude
    private List<ProjectShowcase> showcases = new ArrayList<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    @ToString.Exclude
    private List<ProjectImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    @ToString.Exclude
    private List<ProjectDocument> documents = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "project_skills",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @Builder.Default
    @ToString.Exclude
    private Set<Skill> skills = new HashSet<>();
}
