package nl.lukas.portfolio.project;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "project_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @ToString.Exclude
    private Project project;

    @Column(length = 150, nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String url;

    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;
}
