package rs.pupin.evmer.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import rs.pupin.evmer.enums.UserRoles;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {
        @Value("${jwt.secret}")
        private String jwtSecret;
        @Value("${jwt.expiration}")
        private long jwtExpirationMs;
        @Value("${jwt.refresh-expiration}")
        private long jwtRefreshExpirationMs;
        private SecretKey key;
        // Initializes the key after the class is instantiated and the jwtSecret is injected,
        // preventing the repeated creation of the key and enhancing performance
        @PostConstruct
        public void init() {
            this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        }
        // Generate JWT token
        public String generateToken(
                String username,
                UserRoles role,
                String firstName,
                String lastName
        ) {
            return Jwts.builder()
                    .setSubject(username)
                    .claim("role",role.name())
                    .claim("first_name",firstName)
                    .claim("last_name",lastName)
                    .claim("type","access")
                    .setIssuedAt(new Date())
                    .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                    .signWith(key, SignatureAlgorithm.HS256)
                    .compact();
        }

        public String generateRefreshToken(
                String username
        ){
            return Jwts.builder()
                    .setSubject(username)
                    .claim("type","refresh")
                    .setIssuedAt(new Date())
                    .setExpiration(new Date((new Date()).getTime() + jwtRefreshExpirationMs))
                    .signWith(key, SignatureAlgorithm.HS256)
                    .compact();
        }
        // Get username from JWT token
        public String getUsernameFromToken(String token) {
            return Jwts.parserBuilder()
                    .setSigningKey(key).build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        }
        // Validate JWT accessToken
        public boolean validateAccessJwtToken(String token) {
            try {
                Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
                return true;
            } catch (SecurityException e) {
                System.out.println("Invalid JWT signature: " + e.getMessage());
            } catch (MalformedJwtException e) {
                System.out.println("Invalid JWT token: " + e.getMessage());
            } catch (ExpiredJwtException e) {
                System.out.println("JWT token is expired: " + e.getMessage());
            } catch (UnsupportedJwtException e) {
                System.out.println("JWT token is unsupported: " + e.getMessage());
            } catch (IllegalArgumentException e) {
                System.out.println("JWT claims string is empty: " + e.getMessage());
            }
            return false;
        }

        public boolean validateJwtRefreshToken(String token) {
            try {
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(key)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                return "refresh".equals(
                        claims.get("type", String.class)
                );

            } catch (SecurityException e) {
                System.out.println(
                        "Invalid JWT signature: " + e.getMessage()
                );
            } catch (MalformedJwtException e) {
                System.out.println(
                        "Invalid JWT token: " + e.getMessage()
                );
            } catch (ExpiredJwtException e) {
                System.out.println(
                        "JWT token is expired: " + e.getMessage()
                );
            } catch (UnsupportedJwtException e) {
                System.out.println(
                        "JWT token is unsupported: " + e.getMessage()
                );
            } catch (IllegalArgumentException e) {
                System.out.println(
                        "JWT claims string is empty: " + e.getMessage()
                );
            }
            return false;
        }
    }

