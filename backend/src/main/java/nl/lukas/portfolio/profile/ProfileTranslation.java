package nl.lukas.portfolio.profile;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "profile_translations",
    uniqueConstraints = @UniqueConstraint(columnNames = {"profile_id", "language_code"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileTranslation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    @ToString.Exclude
    private Profile profile;

    @Column(name = "language_code", nullable = false, length = 10)
    private String languageCode;

    @Column(length = 150)
    private String role;

    @Column(length = 255)
    private String focus;

    @Column(columnDefinition = "TEXT")
    private String summary;
}
