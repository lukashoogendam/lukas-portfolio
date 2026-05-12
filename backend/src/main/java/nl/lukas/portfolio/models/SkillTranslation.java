package nl.lukas.portfolio.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "skill_translations",
    uniqueConstraints = @UniqueConstraint(columnNames = {"skill_id", "language_code"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillTranslation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    @ToString.Exclude
    private Skill skill;

    @Column(name = "language_code", nullable = false, length = 10)
    private String languageCode;

    @Column(columnDefinition = "TEXT")
    private String description;
}
