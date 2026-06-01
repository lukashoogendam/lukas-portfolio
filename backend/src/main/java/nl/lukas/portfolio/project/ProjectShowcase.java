package nl.lukas.portfolio.project;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "project_showcases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectShowcase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @ToString.Exclude
    private Project project;

    @Column(length = 50, nullable = false)
    private String type;

    @Column(length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String url;

    @Column(name = "embed_code", columnDefinition = "TEXT")
    private String embedCode;

    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;
}
