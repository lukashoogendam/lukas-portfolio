package nl.lukas.portfolio.home;

import lombok.Builder;
import nl.lukas.portfolio.featuredskill.FeaturedSkillDto;
import nl.lukas.portfolio.profile.ProfileDto;
import nl.lukas.portfolio.project.ProjectListDto;
import nl.lukas.portfolio.skill.SkillDto;
import nl.lukas.portfolio.timeline.TimelineEventDto;
import java.util.List;

@Builder
public record HomeDto(
    ProfileDto profile,
    List<ProjectListDto> highlightedProjects,
    List<SkillDto> allSkills,
    List<FeaturedSkillDto> featuredSkills,
    List<TimelineEventDto> timelineEvents,
    List<HomeSectionDto> homeSections
) {}
