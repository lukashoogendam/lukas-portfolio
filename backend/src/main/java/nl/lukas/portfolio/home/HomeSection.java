package nl.lukas.portfolio.home;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "home_sections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomeSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String identifier;

    @Column(length = 150)
    private String title;

    @Column(name = "title_en", length = 150)
    private String titleEn;

    @Column(length = 255)
    private String subtitle;

    @Column(name = "subtitle_en", length = 255)
    private String subtitleEn;

    @Column(columnDefinition = "TEXT", nullable = false)
    @Builder.Default
    private String content = "";

    @Column(name = "content_en", columnDefinition = "TEXT")
    @Builder.Default
    private String contentEn = "";

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String type = "CUSTOM_TEXT";

    @Column(nullable = false)
    @Builder.Default
    private Boolean visible = true;

    @Column(name = "show_terminal", nullable = false)
    @Builder.Default
    private Boolean showTerminal = false;
}
