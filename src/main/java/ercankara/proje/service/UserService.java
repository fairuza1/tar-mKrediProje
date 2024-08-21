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
    //userRepository: Kullanıcı veritabanı işlemleri için UserRepository sınıfına erişim sağlar.
//passwordEncoder: Kullanıcı şifrelerini güvenli bir şekilde şifrelemek ve çözmek için kullanılan BCryptPasswordEncoder sınıfına erişim sağlar.
//jwtUtil: JWT tokenlarını oluşturmak, doğrulamak ve yönetmek için kullanılan JwtUtil sınıfına erişim sağlar.
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;
    //Giriş işlemi: Bu yöntem, kullanıcının sisteme giriş yapmasını sağlar. Kullanıcının verdiği kullanıcı adı (username) ile veritabanında eşleşen bir kullanıcı aranır.
//Şifre doğrulama: Kullanıcının girdiği şifre, veritabanında kayıtlı olan şifre ile karşılaştırılır. passwordEncoder.matches() metodu, şifrelerin eşleşip eşleşmediğini kontrol eder.
//JWT oluşturma: Eğer şifre doğruysa, jwtUtil.generateToken() metodu kullanılarak kullanıcı için bir JWT tokenı oluşturulur.
//Yanıt: Bu token ve kullanıcı kimliği (userId), LoginResponse objesi olarak döndürülür.
//Hata: Eğer kullanıcı adı bulunamazsa veya şifre yanlışsa, bir hata (RuntimeException) fırlatılır.
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
    //Kayıt işlemi: Bu yöntem, yeni bir kullanıcı hesabı oluşturur.
//Kullanıcı oluşturma: Kullanıcı adı ve şifre, User nesnesine set edilir. Şifre, passwordEncoder kullanılarak güvenli bir şekilde şifrelenir.
//Kullanıcıyı kaydetme: userRepository.save() metodu ile kullanıcı veritabanına kaydedilir.
//JWT oluşturma: Kullanıcı adı ile bir JWT tokenı oluşturulur ve bu token, kullanıcı kimliği ile birlikte döndürülür.
    public LoginResponse signup(LoginRequest request) {
        User user = new User();
        user.setUsername(request.getUser());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getUsername());
        return new LoginResponse(token, user.getId());
    }
    //Kullanıcı bulma: Bu yöntem, kullanıcı adı ile veritabanında eşleşen bir kullanıcıyı bulur ve döndürür.
//Hata: Eğer kullanıcı bulunamazsa, bir hata (RuntimeException) fırlatılır.
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    //Yenileme Token'ı oluşturma: Bu yöntem, kullanıcı adı için bir yenileme token'ı oluşturur.
// Bu token, kullanıcının oturumunu yenilemek için kullanılır ve genellikle daha uzun süre geçerlidir (örneğin, 30 gün).
    public String generateRefreshToken(String username) {
        return jwtUtil.generateRefreshToken(username);
    }
    //Erişim Token'ı yenileme: Bu yöntem, geçerlilik süresi dolmuş bir erişim token'ını (access token) yeniler.
//Yenileme Token'ı kontrol: İlk olarak, verilen yenileme token'ının süresi dolmuş mu kontrol edilir. Eğer süresi dolmuşsa, bir hata fırlatılır.
//Yeni Token oluşturma: Süresi dolmamışsa, yenileme token'ından kullanıcı adı çıkarılır ve bu kullanıcı adı için yeni bir JWT tokenı oluşturulur.
    public String refreshAccessToken(String refreshToken) {
        if (jwtUtil.isTokenExpired(refreshToken)) {
            throw new RuntimeException("Refresh token expired");
        }
        String username = jwtUtil.extractUsername(refreshToken);
        return jwtUtil.generateToken(username);
    }

}