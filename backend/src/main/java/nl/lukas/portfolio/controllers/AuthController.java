package nl.lukas.portfolio.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import nl.lukas.portfolio.dto.request.LoginRequest;
import nl.lukas.portfolio.dto.response.ApiResponse;
import nl.lukas.portfolio.models.User;
import nl.lukas.portfolio.services.UserService;
import nl.lukas.portfolio.utils.CookieUtil;
import nl.lukas.portfolio.utils.JwtUtil;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Admin authentication endpoints")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final CookieUtil cookieUtil;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(JwtUtil jwtUtil, CookieUtil cookieUtil, UserService userService, PasswordEncoder passwordEncoder) {
        this.jwtUtil = jwtUtil;
        this.cookieUtil = cookieUtil;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Authenticate with credentials and receive a JWT cookie")
    public ResponseEntity<ApiResponse<Void>> login(@RequestBody LoginRequest request) {
        User user;
        try {
            user = userService.findByEmail(request.email());
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error(401, "Invalid credentials"));
        }

        boolean isInvalidPassword = !passwordEncoder.matches(request.password(), user.getPassword());
        if (isInvalidPassword) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error(401, "Invalid credentials"));
        }

        String token = jwtUtil.generateToken(user.getEmail());
        ResponseCookie authCookie = cookieUtil.createAuthCookie(token);
        HttpHeaders headers = cookieUtil.createHeadersWithCookie(authCookie);

        return ResponseEntity.ok()
                .headers(headers)
                .body(ApiResponse.<Void>builder()
                        .status(200)
                        .message("Login successful")
                        .build());
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Clear the JWT cookie")
    public ResponseEntity<ApiResponse<Void>> logout() {
        ResponseCookie cookie = cookieUtil.deleteAuthCookie();
        HttpHeaders headers = cookieUtil.createHeadersWithCookie(cookie);

        return ResponseEntity.ok()
                .headers(headers)
                .body(ApiResponse.<Void>builder()
                        .status(200)
                        .message("Logged out successfully")
                        .build());
    }

    @GetMapping("/me")
    @Operation(summary = "Check auth status", description = "Returns current authentication status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> me(Authentication authentication) {
        boolean isNotAuthenticated = authentication == null || !authentication.isAuthenticated();

        if (isNotAuthenticated) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error(401, "Not authenticated"));
        }

        Map<String, Object> data = Map.of(
                "email", authentication.getName(),
                "authenticated", true
        );

        return ResponseEntity.ok(ApiResponse.success("Authenticated", data));
    }
}

