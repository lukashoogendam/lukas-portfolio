package nl.lukas.portfolio.social;

import nl.lukas.portfolio.common.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SocialService {

    private final SocialRepository socialRepository;
    private final SocialMapper socialMapper;

    @Transactional(readOnly = true)
    public List<SocialDto> getAllSocials() {
        return socialRepository.findAllByOrderBySortOrderAsc().stream()
                .map(socialMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SocialDto createSocial(CreateSocialRequest request) {
        Social social = Social.builder()
                .platform(request.platform())
                .url(request.url())
                .icon(request.icon())
                .sortOrder(request.sortOrder())
                .build();
        return socialMapper.toDto(socialRepository.save(social));
    }

    @Transactional
    public SocialDto updateSocial(Long id, UpdateSocialRequest request) {
        Social social = socialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Social not found with id: " + id));

        if (request.platform() != null) social.setPlatform(request.platform());
        if (request.url() != null) social.setUrl(request.url());
        if (request.icon() != null) social.setIcon(request.icon());
        if (request.sortOrder() != null) social.setSortOrder(request.sortOrder());

        return socialMapper.toDto(socialRepository.save(social));
    }

    @Transactional
    public void deleteSocial(Long id) {
        Social social = socialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Social not found with id: " + id));
        socialRepository.delete(social);
    }
}
