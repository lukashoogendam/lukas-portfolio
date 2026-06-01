package nl.lukas.portfolio.social;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "socials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Social {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String platform;

    @Column(nullable = false)
    private String url;

    @Column(length = 50)
    private String icon;

    @Column(name = "sort_order")
    private Integer sortOrder;
}
