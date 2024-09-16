package ercankara.proje.controller;

import ercankara.proje.dto.LoginRequest;
import ercankara.proje.dto.LoginResponse;
import ercankara.proje.service.UserService;
import ercankara.proje.util.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);
        String token = response.getToken();
        String refreshToken = userService.generateRefreshToken(request.getUsername()); // 'getUser' yerine 'getUsername'

        // HTTP-Only cookie oluşturuyoruz
        ResponseCookie authCookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(60 * 60 * 24)
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(30 * 24 * 60 * 60)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<LoginResponse> signup(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = userService.signup(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie authCookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body("Logged out");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@CookieValue("refreshToken") String refreshToken) {
        String newToken = userService.refreshAccessToken(refreshToken);
        if (newToken != null) {
            ResponseCookie authCookie = ResponseCookie.from("jwt", newToken)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(60 * 60 * 24)
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, authCookie.toString())
                    .body("Token refreshed");
        } else {
            return ResponseEntity.status(401).body("Invalid refresh token");
        }
    }
    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(@CookieValue(name = "jwt", required = false) String jwt) {
        Map<String, Boolean> response = new HashMap<>();

        if (jwt != null) {
            try {
                // Token geçerliliğini kontrol ediyoruz
                String username = jwtUtil.extractUsername(jwt);
                if (jwtUtil.validateToken(jwt, username)) {
                    response.put("isValid", true);
                    return ResponseEntity.ok(response);
                }
            } catch (ExpiredJwtException e) {
                response.put("isValid", false);
                return ResponseEntity.status(401).body(response);
            } catch (Exception e) {
                response.put("isValid", false);
                return ResponseEntity.status(400).body(response);
            }
        }

        // Geçersiz veya boş token için cookie temizleniyor
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .build();

        response.put("isValid", false);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);
    }
}
