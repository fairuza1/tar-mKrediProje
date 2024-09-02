package ercankara.proje.controller;

import ercankara.proje.dto.LoginRequest;
import ercankara.proje.dto.LoginResponse;
import ercankara.proje.service.UserService;
import ercankara.proje.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

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
        String refreshToken = userService.generateRefreshToken(request.getUser());

        // HTTP-Only cookie oluşturuyoruz
        ResponseCookie authCookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false) // eğer https kullanıyorsanız, bunu true yapın
                .path("/")
                .maxAge(60 * 60) // access token süresi (15 dakika)
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false) // eğer https kullanıyorsanız, bunu true yapın
                .path("/")
                .maxAge(30 * 24 * 60 * 60) // refresh token süresi (30 gün)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<LoginResponse> signup(@RequestBody LoginRequest request) {
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
                    .secure(false) // eğer https kullanıyorsanız, bunu true yapın
                    .path("/")
                    .maxAge(60 * 60) // access token süresi (60 dakika)
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, authCookie.toString())
                    .body("Token refreshed");
        } else {
            return ResponseEntity.status(401).body("Invalid refresh token");
        }
    }


}