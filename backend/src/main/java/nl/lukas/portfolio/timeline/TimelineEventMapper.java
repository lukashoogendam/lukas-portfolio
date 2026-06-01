package nl.lukas.portfolio.timeline;

import org.springframework.stereotype.Component;

@Component
public class TimelineEventMapper {

    public TimelineEventDto toDto(TimelineEvent event) {
        return TimelineEventDto.builder()
                .id(event.getId())
                .title(event.getTitle())
                .subtitle(event.getSubtitle())
                .type(event.getType())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .current(event.isCurrent())
                .description(event.getDescription())
                .sortOrder(event.getSortOrder())
                .build();
    }
}
