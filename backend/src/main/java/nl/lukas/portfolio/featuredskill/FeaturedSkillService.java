package nl.lukas.portfolio.featuredskill;

import lombok.RequiredArgsConstructor;
import nl.lukas.portfolio.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeaturedSkillService {

    private final FeaturedSkillRepository repository;
    private final FeaturedSkillMapper mapper;

    @Transactional(readOnly = true)
    public List<FeaturedSkillDto> getAll() {
        return repository.findAllByOrderBySortOrderAsc().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public FeaturedSkillDto create(UpsertFeaturedSkillRequest request) {
        FeaturedSkill entity = FeaturedSkill.builder()
                .name(request.name())
                .nameEn(request.nameEn())
                .description(request.description())
                .descriptionEn(request.descriptionEn())
                .category(request.category())
                .icon(request.icon())
                .sortOrder(request.sortOrder() != null ? request.sortOrder() : 0)
                .build();
        return mapper.toDto(repository.save(entity));
    }

    @Transactional
    public FeaturedSkillDto update(Long id, UpsertFeaturedSkillRequest request) {
        FeaturedSkill entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FeaturedSkill not found with id: " + id));

        entity.setName(request.name());
        entity.setNameEn(request.nameEn());
        entity.setDescription(request.description());
        entity.setDescriptionEn(request.descriptionEn());
        if (request.category() != null) entity.setCategory(request.category());
        entity.setIcon(request.icon());
        if (request.sortOrder() != null) entity.setSortOrder(request.sortOrder());

        return mapper.toDto(repository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("FeaturedSkill not found with id: " + id);
        }
        repository.deleteById(id);
    }

    @Transactional
    public void reorder(List<Long> ids) {
        for (int i = 0; i < ids.size(); i++) {
            Long id = ids.get(i);
            int finalI = i;
            repository.findById(id).ifPresent(entity -> {
                entity.setSortOrder(finalI);
                repository.save(entity);
            });
        }
    }
}
