package ercankara.proje.service;

import ercankara.proje.dto.LoginRequest;
import ercankara.proje.dto.LoginResponse;
import ercankara.proje.entity.User;
import ercankara.proje.repository.UserRepository;
import ercankara.proje.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUser())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            String token = jwtUtil.generateToken(user.getUsername());
            return new LoginResponse(token, user.getId());
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }

    public LoginResponse signup(LoginRequest request) {
        User user = new User();
        user.setUsername(request.getUser());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getUsername());
        return new LoginResponse(token, user.getId());
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public String generateRefreshToken(String username) {
        return jwtUtil.generateRefreshToken(username);
    }

    public String refreshAccessToken(String refreshToken) {
        if (jwtUtil.isTokenExpired(refreshToken)) {
            throw new RuntimeException("Refresh token expired");
        }
        String username = jwtUtil.extractUsername(refreshToken);
        return jwtUtil.generateToken(username);
    }

}
