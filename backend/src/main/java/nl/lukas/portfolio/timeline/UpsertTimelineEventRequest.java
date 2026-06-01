package nl.lukas.portfolio.timeline;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record UpsertTimelineEventRequest(
    @NotBlank String title,
    String subtitle,
    String type,
    LocalDate startDate,
    LocalDate endDate,
    boolean current,
    String description,
    Integer sortOrder
) {}
