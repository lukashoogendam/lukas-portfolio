package nl.lukas.portfolio.services;

import nl.lukas.portfolio.dto.mapper.SocialMapper;
import nl.lukas.portfolio.dto.request.CreateSocialRequest;
import nl.lukas.portfolio.dto.request.UpdateSocialRequest;
import nl.lukas.portfolio.dto.response.SocialDto;
import nl.lukas.portfolio.exceptions.ResourceNotFoundException;
import nl.lukas.portfolio.models.Social;
import nl.lukas.portfolio.repositories.SocialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SocialService {

    private final SocialRepository socialRepository;
    private final SocialMapper socialMapper;

    public List<SocialDto> getAllSocials() {
        return socialRepository.findAllByOrderBySortOrderAsc().stream()
                .map(socialMapper::toDto)
                .collect(Collectors.toList());
    }

    public SocialDto createSocial(CreateSocialRequest request) {
        Social social = Social.builder()
                .platform(request.platform())
                .url(request.url())
                .icon(request.icon())
                .sortOrder(request.sortOrder())
                .build();
        return socialMapper.toDto(socialRepository.save(social));
    }

    public SocialDto updateSocial(Long id, UpdateSocialRequest request) {
        Social social = socialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Social not found with id: " + id));

        if (request.platform() != null) social.setPlatform(request.platform());
        if (request.url() != null) social.setUrl(request.url());
        if (request.icon() != null) social.setIcon(request.icon());
        if (request.sortOrder() != null) social.setSortOrder(request.sortOrder());

        return socialMapper.toDto(socialRepository.save(social));
    }

    public void deleteSocial(Long id) {
        Social social = socialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Social not found with id: " + id));
        socialRepository.delete(social);
    }
}
