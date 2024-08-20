package ercankara.proje.controller;

import ercankara.proje.dto.LandDTO;
import ercankara.proje.entity.Land;
import ercankara.proje.entity.User;
import ercankara.proje.repository.LandRepository;
import ercankara.proje.repository.UserRepository;
import ercankara.proje.service.LandService;
import ercankara.proje.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;


import java.util.List;


@RestController
@RequestMapping("/lands")
@CrossOrigin(origins = "http://localhost:5173")
public class LandController {

    @Autowired
    private LandService landService;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private LandRepository landRepository;

    @PostMapping
    public Land createLand(@RequestBody Land land) {
        // Kullanıcıyı userId ile bul
        User user = userRepository.findById(land.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Land nesnesine User'ı set et
        land.setUser(user);

        // Land'ı kaydet
        return landService.saveLand(land);
    }

    @GetMapping
    public List<LandDTO> getLandsByUser() {
        // Oturum açan kullanıcının kimliğini al
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // UserService'den kullanıcıyı al
        User user = userService.findByUsername(username);

        // Kullanıcı ID'sine göre arazileri getir
        return landService.getLandsByUser(user.getId());
    }

    @GetMapping("/detail/{id}")
    public LandDTO getLandById(@PathVariable Long id) {
        return landService.getLandById(id);
    }

    @PutMapping("/update/{id}")
    public Land updateLand(@PathVariable Long id, @RequestBody LandDTO landDto) {
        // LandService'i kullanarak araziyi güncelle
        return landService.updateLand(id, landDto);
    }
    public int getAvailableLand(Long landId) {
        Land land = landRepository.findById(landId)
                .orElseThrow(() -> new RuntimeException("Arazi bulunamadı."));
        return land.getRemainingArea();
    }
}