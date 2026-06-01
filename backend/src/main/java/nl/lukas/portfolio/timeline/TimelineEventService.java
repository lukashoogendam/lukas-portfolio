package nl.lukas.portfolio.timeline;

import lombok.RequiredArgsConstructor;
import nl.lukas.portfolio.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimelineEventService {

    private final TimelineEventRepository repository;
    private final TimelineEventMapper mapper;

    @Transactional(readOnly = true)
    public List<TimelineEventDto> getAll() {
        return repository.findAllByOrderBySortOrderAscStartDateDesc().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TimelineEventDto getById(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("TimelineEvent not found with id: " + id));
    }

    @Transactional
    public TimelineEventDto create(UpsertTimelineEventRequest request) {
        TimelineEvent event = TimelineEvent.builder()
                .title(request.title())
                .subtitle(request.subtitle())
                .type(request.type())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .current(request.current())
                .description(request.description())
                .sortOrder(request.sortOrder() != null ? request.sortOrder() : 0)
                .build();
        return mapper.toDto(repository.save(event));
    }

    @Transactional
    public TimelineEventDto update(Long id, UpsertTimelineEventRequest request) {
        TimelineEvent event = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TimelineEvent not found with id: " + id));

        event.setTitle(request.title());
        event.setSubtitle(request.subtitle());
        event.setType(request.type());
        event.setStartDate(request.startDate());
        event.setEndDate(request.endDate());
        event.setCurrent(request.current());
        event.setDescription(request.description());
        if (request.sortOrder() != null) event.setSortOrder(request.sortOrder());

        return mapper.toDto(repository.save(event));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("TimelineEvent not found with id: " + id);
        }
        repository.deleteById(id);
    }
}
