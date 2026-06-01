package nl.lukas.portfolio.seeder;

import nl.lukas.portfolio.auth.User;
import nl.lukas.portfolio.auth.Role;
import nl.lukas.portfolio.auth.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
@ConditionalOnProperty(name = "app.seeder.enabled", havingValue = "true", matchIfMissing = true)
public class AdminInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    public AdminInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail(adminEmail)) {
            logger.info("Admin user not found in database. Creating default admin user: {}", adminEmail);

            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setFirstName("Lukas");
            admin.setLastName("Admin");
            admin.setRole(Role.ADMIN);

            userRepository.save(admin);
            logger.info("Admin user created successfully.");
        } else {
            logger.info("Admin user already exists. Skipping admin initialization.");
        }

        if (!userRepository.existsByEmail("user@gmail.com")) {
            logger.info("Creating demo user: user@gmail.com");
            User demoUser = new User();
            demoUser.setEmail("user@gmail.com");
            demoUser.setPassword(passwordEncoder.encode("Test123!"));
            demoUser.setFirstName("Demo");
            demoUser.setLastName("User");
            demoUser.setRole(Role.USER);
            userRepository.save(demoUser);
        }
    }
}
