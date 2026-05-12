package nl.lukas.portfolio.utils;

import nl.lukas.portfolio.config.CookieProperties;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookieUtil {

    private final CookieProperties props;

    public CookieUtil(CookieProperties props) {
        this.props = props;
    }

    public ResponseCookie createAuthCookie(String token) {
        return ResponseCookie.from("jwt", token)
                .httpOnly(props.isHttpOnly())
                .secure(props.isSecure())
                .sameSite(props.getSameSite())
                .path(props.getPath())
                .maxAge(props.getMaxAge())
                .build();
    }

    public ResponseCookie deleteAuthCookie() {
        return ResponseCookie.from("jwt", "")
                .httpOnly(props.isHttpOnly())
                .secure(props.isSecure())
                .sameSite(props.getSameSite())
                .path(props.getPath())
                .maxAge(0)
                .build();
    }

    public HttpHeaders createHeadersWithCookie(ResponseCookie cookie) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, cookie.toString());
        return headers;
    }

    public String extractTokenFromRequest(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (var cookie : request.getCookies()) {
                if (cookie.getName().equals("jwt")) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}

