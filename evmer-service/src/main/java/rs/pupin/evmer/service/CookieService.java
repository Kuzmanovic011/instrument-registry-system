package rs.pupin.evmer.service;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class CookieService {
    @Value("${jwt.refresh-expiration}")
    private long refreshExpirationMs;

    public String getRefreshToken(
            HttpServletRequest request
    ) {
        if (request.getCookies() == null) {
            return null;
        }

        for (Cookie cookie : request.getCookies()) {
            if ("refreshToken".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }
    public void setRefreshToken(
            HttpServletResponse response,
            String refreshToken
    ) {
        Cookie cookie = new Cookie("refreshToken", refreshToken);

        cookie.setHttpOnly(true);
        cookie.setSecure(false); // za localhost na produkciji stavi true
        cookie.setPath("/");
        cookie.setMaxAge((int) (refreshExpirationMs / 1000));

        response.addCookie(cookie);
    }

    public void deleteRefreshToken(
            HttpServletResponse response
    ) {
        Cookie cookie = new Cookie("refreshToken", null);

        cookie.setHttpOnly(true);
        //Kada budes imao HTTPS, promeni na: cookie.setSecure(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);

        response.addCookie(cookie);
    }
}
