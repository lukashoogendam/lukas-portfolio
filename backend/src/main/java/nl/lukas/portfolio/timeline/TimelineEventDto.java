package nl.lukas.portfolio.timeline;

import lombok.Builder;
import java.time.LocalDate;

@Builder
public record TimelineEventDto(
    Long id,
    String title,
    String subtitle,
    String type,
    LocalDate startDate,
    LocalDate endDate,
    boolean current,
    String description,
    Integer sortOrder
) {}
