package rs.pupin.evmer.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import rs.pupin.evmer.dto.LoginRequest;
import rs.pupin.evmer.dto.LoginResponse;
import rs.pupin.evmer.service.AuthService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse authenticateUser(
            @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        return authService.autheticateUser(request, response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(
            HttpServletRequest request
    ) {
        return authService.refreshToken(request);
    }

}