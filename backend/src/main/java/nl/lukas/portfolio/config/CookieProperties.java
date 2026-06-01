package nl.lukas.portfolio.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "cookie")
public class CookieProperties {
    private boolean httpOnly;
    private boolean secure;
    private String sameSite;
    private String path;
    private int maxAge;
}
