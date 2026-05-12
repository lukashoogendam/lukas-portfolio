package nl.lukas.portfolio.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.lukas.portfolio.models.Assignment;
import nl.lukas.portfolio.models.Project;
import nl.lukas.portfolio.models.Skill;
import nl.lukas.portfolio.repositories.AssignmentRepository;
import nl.lukas.portfolio.repositories.ProfileRepository;
import nl.lukas.portfolio.repositories.ProjectRepository;
import nl.lukas.portfolio.repositories.SkillRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final AssignmentRepository assignmentRepository;
    private final ProfileRepository profileRepository;

    @Override
    public void run(String... args) {
        if (projectRepository.count() > 0) {
            log.info("DataSeeder: database al gevuld, seed wordt overgeslagen.");
            return;
        }

        log.info("DataSeeder: database is leeg, seed data wordt geladen...");
        seedSkills();
        seedProjects();
        seedAssignments();
        seedProfile();
        log.info("DataSeeder: seed klaar.");
    }

    private void seedSkills() {
        List<Skill> skills = List.of(
            Skill.builder().name("Java").category("Backend").level("Intermediate").description("Object-oriented programming met Java 17+").build(),
            Skill.builder().name("Spring Boot").category("Backend").level("Intermediate").description("REST APIs, JPA, Security, Validation").build(),
            Skill.builder().name("PostgreSQL").category("Database").level("Intermediate").description("Relationeel database design, SQL queries, star schemas").build(),
            Skill.builder().name("Angular").category("Frontend").level("Intermediate").description("Standalone components, RxJS, Angular Material").build(),
            Skill.builder().name("Python").category("Backend").level("Beginner").description("Data scripts, API integratie, automatisering").build(),
            Skill.builder().name("Docker").category("DevOps").level("Beginner").description("Containerisatie en deployment").build(),
            Skill.builder().name("Git").category("Tools").level("Intermediate").description("Version control, branching strategies").build(),
            Skill.builder().name("HTML/CSS").category("Frontend").level("Intermediate").description("Responsive design, SCSS, moderne layouts").build(),
            Skill.builder().name("TypeScript").category("Frontend").level("Intermediate").description("Typed JavaScript voor Angular development").build(),
            Skill.builder().name("REST APIs").category("Backend").level("Intermediate").description("Ontwerpen en consumeren van RESTful services").build(),
            Skill.builder().name("Flyway").category("Database").level("Beginner").description("Database migratie beheer").build(),
            Skill.builder().name("Flutter").category("Frontend").level("Intermediate").description("Mobiele app ontwikkeling met Dart").build()
        );
        skillRepository.saveAll(skills);
        log.info("DataSeeder: {} skills opgeslagen.", skills.size());
    }

    private void seedProjects() {

        Skill java        = findSkill("Java");
        Skill springBoot  = findSkill("Spring Boot");
        Skill postgres    = findSkill("PostgreSQL");
        Skill angular     = findSkill("Angular");
        Skill python      = findSkill("Python");
        Skill docker      = findSkill("Docker");
        Skill git         = findSkill("Git");
        Skill typescript  = findSkill("TypeScript");
        Skill rest        = findSkill("REST APIs");
        Skill flutter     = findSkill("Flutter");

        List<Project> projects = List.of(
            Project.builder()
                .slug("youtube-dashboard")
                .title("YouTube Data Dashboard")
                .shortDescription("Dashboard voor het ophalen, opslaan en analyseren van YouTube-data.")
                .description("Een uitgebreid data-dashboard dat YouTube-video's analyseert op views, likes, comments en engagement. Het project combineert een Python data-ingestie pipeline, een PostgreSQL star schema database, een Spring Boot REST API en een Angular frontend met interactieve grafieken.")
                .category("Schoolproject")
                .status("Afgerond")
                .startDate(LocalDate.of(2025, 9, 1))
                .endDate(LocalDate.of(2026, 1, 15))
                .repositoryUrl("https://github.com/lukas/youtube-dashboard")
                .role("Data engineer & backend developer")
                .highlights("Python ETL pipeline gebouwd die YouTube API-data ophaalt en transformeert naar een PostgreSQL star schema. Spring Boot REST API ontwikkeld voor het serveren van geaggregeerde data aan de Angular frontend met interactieve Chart.js grafieken.")
                .features("[\"Python ETL pipeline met YouTube Data API v3\", \"PostgreSQL star schema\", \"Spring Boot REST API\", \"Angular dashboard met Chart.js\", \"Docker Compose setup\"]")
                .skills(Set.of(springBoot, postgres, angular, python, docker))
                .build(),

            Project.builder()
                .slug("b4llrz-app")
                .title("B4llrz Mobile App")
                .shortDescription("Een mobiele app voor basketbalspelers om hun skills bij te houden.")
                .description("B4llrz is een Flutter-applicatie ontworpen voor basketbalspelers. Spelers kunnen hun profiel beheren, skills bijhouden via een gamification-systeem met XP en levels, en challenges voltooien. De app bevat een Spring Boot backend met PostgreSQL database, authenticatie en een admin panel.")
                .category("Schoolproject")
                .status("Afgerond")
                .startDate(LocalDate.of(2025, 9, 1))
                .endDate(LocalDate.of(2026, 4, 20))
                .repositoryUrl("https://github.com/lukas/b4llrz")
                .role("Full-stack developer (Flutter + Spring Boot)")
                .highlights("Complete mobiele applicatie gebouwd met Flutter voor de frontend en Spring Boot voor de backend. Gamification-systeem ontworpen met XP, levels en uitdagingen. JWT-authenticatie en admin panel geïmplementeerd.")
                .features("[\"Flutter UI met custom widgets\", \"Spring Boot backend met JWT\", \"Gamification systeem (XP, levels, challenges)\", \"Admin panel\", \"PostgreSQL met Flyway\"]")
                .skills(Set.of(java, springBoot, postgres, git, flutter))
                .build(),

            Project.builder()
                .slug("spring-boot-chatbot")
                .title("AI Chatbot met Spring Boot")
                .shortDescription("Een chatbot applicatie gebouwd met Spring Boot en LLM-integratie.")
                .description("Een intelligente chatbot die gebruik maakt van Spring Boot als backend en een Angular frontend. De chatbot communiceert met Large Language Models via Ollama of Groq API voor het genereren van natuurlijke antwoorden.")
                .category("Eigen project")
                .status("In ontwikkeling")
                .startDate(LocalDate.of(2026, 2, 1))
                .repositoryUrl("https://github.com/lukas/chatbot")
                .role("Backend developer & prompt engineer")
                .highlights("Chatbot applicatie gebouwd die communiceert met Large Language Models. Streaming responses geïmplementeerd voor real-time antwoorden.")
                .features("[\"Spring Boot backend\", \"LLM integratie via Ollama\", \"Streaming responses\", \"Angular chat UI\"]")
                .skills(Set.of(java, springBoot, angular, typescript))
                .build(),

            Project.builder()
                .slug("portfolio-api")
                .title("Portfolio als API")
                .shortDescription("Deze portfolio-website, gebouwd als interactieve API-omgeving.")
                .description("Een unieke portfolio-website die werkt als een interactieve API Explorer, vergelijkbaar met Postman. Bezoekers kunnen endpoints aanroepen om informatie op te halen over projecten, skills en ervaringen.")
                .category("Eigen project")
                .status("In ontwikkeling")
                .startDate(LocalDate.of(2026, 5, 1))
                .repositoryUrl("https://github.com/lukas/portfolio-api")
                .role("Full-stack developer")
                .highlights("Portfolio-website ontworpen en gebouwd als interactieve API Explorer. Bezoekers kunnen live endpoints aanroepen.")
                .features("[\"Interactieve API Explorer\", \"Live endpoint testing\", \"Spring Boot REST API\", \"Angular standalone components\", \"JWT authenticatie\"]")
                .skills(Set.of(java, springBoot, postgres, angular, typescript, rest))
                .build()
        );

        projectRepository.saveAll(projects);
        log.info("DataSeeder: {} projecten opgeslagen.", projects.size());
    }

    private void seedAssignments() {
        Project youtubeDashboard = projectRepository.findBySlug("youtube-dashboard").orElse(null);
        Project b4llrz            = projectRepository.findBySlug("b4llrz-app").orElse(null);

        List<Assignment> assignments = List.of(
            Assignment.builder()
                .slug("data-advanced-eindopdracht")
                .title("Data Advanced eindopdracht")
                .courseName("Data Advanced")
                .description("Ontwerp en implementatie van een data-dashboard met PostgreSQL star schema en Python ETL pipeline.")
                .project(youtubeDashboard)
                .documentUrl("https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-techniques.pdf") 
                .build(),

            Assignment.builder()
                .slug("mobile-development-eindproject")
                .title("Mobile Development eindproject")
                .courseName("Mobile Development")
                .description("Ontwikkeling van een volledige mobiele applicatie met Flutter, inclusief backend integratie.")
                .project(b4llrz)
                .build(),

            Assignment.builder()
                .slug("backend-development-opdracht")
                .title("Backend Development opdracht")
                .courseName("Backend Development")
                .description("Bouwen van een REST API met Spring Boot, inclusief authenticatie, validatie en database-integratie.")
                .build(),

            Assignment.builder()
                .slug("frontend-development-opdracht")
                .title("Frontend Development opdracht")
                .courseName("Frontend Development")
                .description("Ontwikkeling van een Angular applicatie met standalone components en API-integratie.")
                .build()
        );

        assignmentRepository.saveAll(assignments);
        log.info("DataSeeder: {} opdrachten opgeslagen.", assignments.size());
    }

    private Skill findSkill(String name) {
        return skillRepository.findByName(name)
            .orElseThrow(() -> new IllegalStateException("Skill niet gevonden: " + name));
    }

    private void seedProfile() {
        nl.lukas.portfolio.models.Profile profile = nl.lukas.portfolio.models.Profile.builder()
                .name("Lukas")
                .role("Informatica student")
                .focus("Backend development with Spring Boot")
                .location("Nederland")
                .summary("Ik ben een Informatica student met interesse in backend development, REST API's en data. " +
                        "Ik bouw graag applicaties met Spring Boot, PostgreSQL en Angular.")
                .email("lukas@example.com")
                .github("https://github.com/lukas")
                .linkedin("https://linkedin.com/in/lukas")
                .build();
        profileRepository.save(profile);
        log.info("DataSeeder: profiel opgeslagen.");
    }
}
