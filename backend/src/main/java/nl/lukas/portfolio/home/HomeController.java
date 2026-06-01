package nl.lukas.portfolio.home;

import lombok.RequiredArgsConstructor;
import nl.lukas.portfolio.common.ApiResponse;
import nl.lukas.portfolio.featuredskill.FeaturedSkillDto;
import nl.lukas.portfolio.featuredskill.FeaturedSkillService;
import nl.lukas.portfolio.profile.ProfileDto;
import nl.lukas.portfolio.profile.ProfileService;
import nl.lukas.portfolio.project.ProjectListDto;
import nl.lukas.portfolio.project.ProjectService;
import nl.lukas.portfolio.skill.SkillDto;
import nl.lukas.portfolio.skill.SkillService;
import nl.lukas.portfolio.timeline.TimelineEventDto;
import nl.lukas.portfolio.timeline.TimelineEventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
public class HomeController {

    private final ProfileService profileService;
    private final ProjectService projectService;
    private final SkillService skillService;
    private final TimelineEventService timelineService;
    private final HomeSectionService homeSectionService;
    private final FeaturedSkillService featuredSkillService;

    @GetMapping
    public ResponseEntity<ApiResponse<HomeDto>> getHomeData(
            @RequestParam(name = "lang", defaultValue = "nl") String lang) {

        ProfileDto profile = profileService.getProfile(lang);

        List<ProjectListDto> highlightedProjects = projectService.getAllProjects(lang).stream()
                .filter(ProjectListDto::highlighted)
                .collect(Collectors.toList());

        List<SkillDto> allSkills = skillService.getAllSkills(lang);

        List<FeaturedSkillDto> featuredSkills = featuredSkillService.getAll();

        List<TimelineEventDto> timelineEvents = timelineService.getAll();
        List<HomeSectionDto> homeSections = homeSectionService.getAll();

        HomeDto homeDto = HomeDto.builder()
                .profile(profile)
                .highlightedProjects(highlightedProjects)
                .allSkills(allSkills)
                .featuredSkills(featuredSkills)
                .timelineEvents(timelineEvents)
                .homeSections(homeSections)
                .build();

        return ResponseEntity.ok(ApiResponse.success("Home data retrieved successfully", homeDto));
    }
}
