package nl.lukas.portfolio.security;

import com.auth0.jwt.exceptions.JWTVerificationException;
import nl.lukas.portfolio.auth.UserService;
import nl.lukas.portfolio.common.CookieUtil;
import nl.lukas.portfolio.common.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final CookieUtil cookieUtil;

    public JwtFilter(UserService userService, JwtUtil jwtUtil, CookieUtil cookieUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.cookieUtil = cookieUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = cookieUtil.extractTokenFromRequest(request);

        boolean hasToken = token != null && !token.isBlank();
        if (hasToken) {
            try {
                String email = jwtUtil.validateTokenAndRetrieveSubject(token);
                UserDetails userDetails = userService.loadUserByUsername(email);
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, userDetails.getPassword(), userDetails.getAuthorities());

                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (JWTVerificationException ignored) {
            }
        }

        filterChain.doFilter(request, response);
    }
}
