package nl.lukas.portfolio.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "assignment_translations",
    uniqueConstraints = @UniqueConstraint(columnNames = {"assignment_id", "language_code"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentTranslation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    @ToString.Exclude
    private Assignment assignment;

    @Column(name = "language_code", nullable = false, length = 10)
    private String languageCode;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;
}
