package ercankara.proje.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {
//Bu değişken, tokenları imzalamak ve doğrulamak için kullanılan bir gizli anahtardır. "secret" kelimesi base64 formatında kodlanarak SECRET_KEY olarak saklanır.
    private String SECRET_KEY = Base64.getEncoder().encodeToString("secret".getBytes());
//Bu yöntem, verilen token'ın içinden kullanıcı adını (subject) çıkartır.
//Token içindeki "subject" (konu), genellikle kullanıcı adı gibi kimlik doğrulama ile ilgili bilgileri içerir.
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
//Bu yöntem, verilen token'ın geçerlilik süresinin bitiş tarihini çıkartır.
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
//Bu yöntem, token'ın içindeki belirli bir alanı (claim) çıkartmak için genel bir yöntemdir.
//claimsResolver fonksiyonu, token içindeki istenen bilgiyi çıkartmak için kullanılır.
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
//Bu yöntem, token'ın tamamını ayrıştırır ve tüm alanları (claims) döner.
//Token, gizli anahtar kullanılarak ayrıştırılır. Eğer token geçersizse, bir hata fırlatılır.
    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT token", e);
        }
    }
//Bu yöntem, token'ın süresinin dolup dolmadığını kontrol eder.
    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
//Bu yöntem, 30 gün geçerli olacak şekilde bir "refresh token" (yenileme token'ı) oluşturur.
//"Refresh token" genellikle kullanıcı oturumunu yenilemek için kullanılır.
    public String generateRefreshToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 30)) // 30 gün geçerli
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }
//Bu yöntem, 15 dakika geçerli olacak şekilde bir JWT oluşturur.
//Kullanıcı adı ile ilişkili bir token döner.
public String generateToken(String username) {
    Map<String, Object> claims = new HashMap<>();
    return createToken(claims, username);
}
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 15)) // 15 dakika geçerli
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }
//Bu yöntem, token'ın geçerli olup olmadığını ve doğru kullanıcıya ait olup olmadığını kontrol eder.
//Kullanıcı adı ve token'ın süresi kontrol edilerek doğrulama yapılır.
    public Boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }
}
//Bu sınıf, JWT tokenlarının oluşturulması, doğrulanması ve içeriğinden bilgi çıkartılması için kullanılır. JWT tokenları, genellikle web uygulamalarında kimlik doğrulama amacıyla kullanılır.
// Bu sınıf, bir kullanıcının kimlik doğrulama token'ını oluşturmanıza ve bu token'ı doğrulamanıza olanak tanır.