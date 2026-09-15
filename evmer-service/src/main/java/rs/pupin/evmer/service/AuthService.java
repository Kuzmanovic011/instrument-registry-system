package rs.pupin.evmer.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import rs.pupin.evmer.dto.LoginRequest;
import rs.pupin.evmer.dto.LoginResponse;
import rs.pupin.evmer.model.User;
import rs.pupin.evmer.repository.UserRepository;
import rs.pupin.evmer.security.JwtUtil;

@Service
@AllArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtils;
    private final CookieService cookieService;

    public LoginResponse autheticateUser(
            LoginRequest request,
            HttpServletResponse response
    ){
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(),
                        request.password()
                )
        );
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        User user = userRepository.findByUsername(request.username());
        String accessToken = jwtUtils.generateToken(
                user.getUsername(),
                user.getRole(),
                user.getFirstName(),
                user.getLastName()
        );

        String refreshToken = jwtUtils.generateRefreshToken(
                user.getUsername()
        );
        cookieService.setRefreshToken(
                response,
                refreshToken
        );
        return new LoginResponse(accessToken);
    }

    public ResponseEntity<?> refreshToken(
            HttpServletRequest request
    ){
        String refreshToken =
                cookieService.getRefreshToken(request);

        if (refreshToken == null ||
                !jwtUtils.validateJwtRefreshToken(refreshToken)) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        String username = jwtUtils.getUsernameFromToken(refreshToken);
        User user = userRepository.findByUsername(username);

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        String newAccessToken = jwtUtils.generateToken(
                user.getUsername(),
                user.getRole(),
                user.getFirstName(),
                user.getLastName()
        );

        return ResponseEntity.ok(newAccessToken);
    }
}
