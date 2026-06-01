package nl.lukas.portfolio.common;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import nl.lukas.portfolio.config.JwtProperties;
import org.springframework.stereotype.Component;

import java.util.Calendar;
import java.util.Date;

@Component
public class JwtUtil {

    private final String secret;

    public JwtUtil(JwtProperties jwtProperties) {
        this.secret = jwtProperties.secret();
    }

    public String generateToken(String email) throws IllegalArgumentException, JWTCreationException {
        return JWT.create()
                .withSubject("User Details")
                .withClaim("email", email)
                .withIssuedAt(new Date())
                .withExpiresAt(this.createExpirationDate())
                .withIssuer("lukas-portfolio")
                .sign(Algorithm.HMAC256(secret));
    }

    public String validateTokenAndRetrieveSubject(String token) throws JWTVerificationException {
        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret))
                .withSubject("User Details")
                .withIssuer("lukas-portfolio")
                .build();
        DecodedJWT jwt = verifier.verify(token);
        return jwt.getClaim("email").asString();
    }

    private Date createExpirationDate() {
        int expirationHours = 6;
        Calendar appendableDate = Calendar.getInstance();
        appendableDate.setTime(new Date());
        appendableDate.add(Calendar.HOUR, expirationHours);
        return appendableDate.getTime();
    }
}
