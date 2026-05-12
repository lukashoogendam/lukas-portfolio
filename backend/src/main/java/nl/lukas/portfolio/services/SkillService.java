package nl.lukas.portfolio.services;

import nl.lukas.portfolio.dto.mapper.SkillMapper;
import nl.lukas.portfolio.dto.request.CreateSkillRequest;
import nl.lukas.portfolio.dto.request.UpdateSkillRequest;
import nl.lukas.portfolio.dto.request.UpsertSkillTranslationRequest;
import nl.lukas.portfolio.dto.response.SkillDto;
import nl.lukas.portfolio.exceptions.ResourceNotFoundException;
import nl.lukas.portfolio.models.Skill;
import nl.lukas.portfolio.models.SkillTranslation;
import nl.lukas.portfolio.repositories.SkillRepository;
import nl.lukas.portfolio.repositories.SkillTranslationRepository;
import nl.lukas.portfolio.utils.LanguageHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;
    private final SkillMapper skillMapper;
    private final SkillTranslationRepository translationRepository;



    @Transactional(readOnly = true)
    public List<SkillDto> getAllSkills(String lang) {
        String resolvedLang = LanguageHelper.resolveLang(lang);
        return skillRepository.findAllByOrderByCategoryAscNameAsc().stream()
                .map(skill -> skillMapper.toDto(skill, getTranslation(skill.getId(), resolvedLang)))
                .collect(Collectors.toList());
    }

    @Transactional
    public SkillDto createSkill(CreateSkillRequest request) {
        Skill skill = Skill.builder()
                .name(request.name())
                .category(request.category())
                .level(request.level())
                .description(request.description())
                .build();
        return skillMapper.toDto(skillRepository.save(skill), Optional.empty());
    }

    @Transactional
    public SkillDto updateSkill(Long id, UpdateSkillRequest request) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));

        if (request.name() != null) skill.setName(request.name());
        if (request.category() != null) skill.setCategory(request.category());
        if (request.level() != null) skill.setLevel(request.level());
        if (request.description() != null) skill.setDescription(request.description());

        return skillMapper.toDto(skillRepository.save(skill), Optional.empty());
    }

    @Transactional
    public void deleteSkill(Long id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
        skillRepository.delete(skill);
    }

    @Transactional
    public SkillDto upsertTranslation(Long id, String lang, UpsertSkillTranslationRequest request) {
        String resolvedLang = LanguageHelper.resolveLang(lang);
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));

        SkillTranslation translation = translationRepository
                .findBySkillIdAndLanguageCode(id, resolvedLang)
                .orElse(SkillTranslation.builder()
                        .skill(skill)
                        .languageCode(resolvedLang)
                        .build());

        translation.setDescription(request.description());
        translationRepository.save(translation);

        return skillMapper.toDto(skill, Optional.of(translation));
    }

    @Transactional(readOnly = true)
    public SkillDto getTranslationForAdmin(Long id, String lang) {
        String resolvedLang = LanguageHelper.resolveLang(lang);
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
        Optional<SkillTranslation> translation = getTranslation(id, resolvedLang);
        return skillMapper.toDto(skill, translation, false);
    }

    private Optional<SkillTranslation> getTranslation(Long skillId, String lang) {
        if (LanguageHelper.DEFAULT_LANG.equals(lang)) return Optional.empty();
        return translationRepository.findBySkillIdAndLanguageCode(skillId, lang);
    }
}
