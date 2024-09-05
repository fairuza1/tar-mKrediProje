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

    // Login metodu: Kullanıcı adı ve şifre doğrulaması yapar ve JWT token döner
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseGet(() -> userRepository.findByEmail(request.getUsername())
                        .orElseThrow(() -> new RuntimeException("User not found")));

        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            String token = jwtUtil.generateToken(user.getUsername());
            return new LoginResponse(token, user.getId(), user.getUsername()); // username'i yanıtla birlikte gönder
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }

    // Signup metodu: Yeni kullanıcı kaydı oluşturur
    public LoginResponse signup(LoginRequest request) {
        // Email'in null olup olmadığını ve zaten kullanılıp kullanılmadığını kontrol eder
        if (request.getEmail() == null || userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is null or already in use");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername());
        return new LoginResponse(token, user.getId(), user.getUsername());  // username'i de döndürüyoruz
    }

    // Kullanıcı adı ile kullanıcıyı bulur
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Yeni bir refresh token üretir
    public String generateRefreshToken(String username) {
        return jwtUtil.generateRefreshToken(username);
    }

    // Refresh token ile access token'ı yeniler
    public String refreshAccessToken(String refreshToken) {
        if (jwtUtil.isTokenExpired(refreshToken)) {
            throw new RuntimeException("Refresh token expired");
        }
        String username = jwtUtil.extractUsername(refreshToken);
        return jwtUtil.generateToken(username);
    }
}
