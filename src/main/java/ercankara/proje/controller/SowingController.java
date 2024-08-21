package ercankara.proje.controller;

import ercankara.proje.dto.SowingDTO;
import ercankara.proje.entity.Sowing;
import ercankara.proje.entity.User;
import ercankara.proje.service.SowingService;
import ercankara.proje.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sowings")
@CrossOrigin(origins = "http://localhost:5173")
public class SowingController {

    @Autowired
    private SowingService sowingService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<String> createSowing(@RequestBody SowingDTO sowingDto) {
        // Ekim miktarını kontrol et
        if (sowingDto.getAmount() == null || sowingDto.getAmount() <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Ekim miktarı sıfır veya negatif olamaz.");
        }

        // Mevcut arazi alanını kontrol etmek için gerekli kod
        int availableLand = sowingService.getAvailableLand(sowingDto.getLandId());

        // Ekim miktarını kontrol et
        if (sowingDto.getAmount() > availableLand) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Ekim miktarı mevcut arazi alanını aşıyor. Mevcut: " + availableLand);
        }

        // Ekim kaydını oluştur
        sowingService.saveSowing(sowingDto);
        return ResponseEntity.ok("Ekim başarılı!");
    }

    @GetMapping
    public List<SowingDTO> getSowingsByUser() {
        // Oturum açan kullanıcının kimliğini al
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // UserService'den kullanıcıyı al
        User user = userService.findByUsername(username);

        // Kullanıcı ID'sine göre ekimleri getir
        return sowingService.getSowingsByUser(user.getId());
    }

    @GetMapping("/detail/{id}")
    public SowingDTO getSowingById(@PathVariable Long id) {
        return sowingService.getSowingById(id);
    }

    @PutMapping("/update/{id}")
    public Sowing updateSowing(@PathVariable Long id, @RequestBody SowingDTO sowingDTO) {
        // SowingService'i kullanarak ekimi güncelle
        return sowingService.updateSowing(id, sowingDTO);
    }
}
