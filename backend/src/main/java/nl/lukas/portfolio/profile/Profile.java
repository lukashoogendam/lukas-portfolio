package nl.lukas.portfolio.profile;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 150)
    private String role;

    @Column(length = 255)
    private String focus;

    @Column(length = 100)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(length = 255)
    private String email;
}
