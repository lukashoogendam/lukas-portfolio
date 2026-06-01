package nl.lukas.portfolio.home;

import lombok.RequiredArgsConstructor;
import nl.lukas.portfolio.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomeSectionService {

    private final HomeSectionRepository repository;
    private final HomeSectionMapper mapper;

    @Transactional(readOnly = true)
    public List<HomeSectionDto> getAll() {
        return repository.findAllByOrderBySortOrderAsc().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public HomeSectionDto getById(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("HomeSection not found with id: " + id));
    }

    @Transactional
    public HomeSectionDto create(UpsertHomeSectionRequest request) {
        HomeSection section = HomeSection.builder()
                .identifier(request.identifier())
                .title(request.title())
                .titleEn(request.titleEn())
                .subtitle(request.subtitle())
                .subtitleEn(request.subtitleEn())
                .content(request.content() != null ? request.content() : "")
                .contentEn(request.contentEn() != null ? request.contentEn() : "")
                .sortOrder(request.sortOrder() != null ? request.sortOrder() : 0)
                .type(request.type() != null ? request.type() : "CUSTOM_TEXT")
                .visible(request.visible() != null ? request.visible() : true)
                .showTerminal(request.showTerminal() != null ? request.showTerminal() : false)
                .build();
        return mapper.toDto(repository.save(section));
    }

    @Transactional
    public HomeSectionDto update(Long id, UpsertHomeSectionRequest request) {
        HomeSection section = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("HomeSection not found with id: " + id));

        section.setIdentifier(request.identifier());
        section.setTitle(request.title());
        section.setTitleEn(request.titleEn());
        section.setSubtitle(request.subtitle());
        section.setSubtitleEn(request.subtitleEn());
        if (request.content() != null) section.setContent(request.content());
        if (request.contentEn() != null) section.setContentEn(request.contentEn());
        if (request.sortOrder() != null) section.setSortOrder(request.sortOrder());
        if (request.type() != null) section.setType(request.type());
        if (request.visible() != null) section.setVisible(request.visible());
        if (request.showTerminal() != null) section.setShowTerminal(request.showTerminal());

        return mapper.toDto(repository.save(section));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("HomeSection not found with id: " + id);
        }
        repository.deleteById(id);
    }

    @Transactional
    public void reorderSections(List<Long> ids) {
        for (int i = 0; i < ids.size(); i++) {
            Long id = ids.get(i);
            int finalI = i;
            repository.findById(id).ifPresent(section -> {
                section.setSortOrder(finalI);
                repository.save(section);
            });
        }
    }
}
