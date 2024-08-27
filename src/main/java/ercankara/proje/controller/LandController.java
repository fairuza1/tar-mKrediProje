package ercankara.proje.controller;

import ercankara.proje.dto.LandDTO;
import ercankara.proje.entity.Land;
import ercankara.proje.entity.User;
import ercankara.proje.repository.LandRepository;
import ercankara.proje.repository.UserRepository;
import ercankara.proje.service.LandService;
import ercankara.proje.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    private LandRepository landRepository;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<LandDTO> createLand(@RequestPart("land") LandDTO landDto,
                                              @RequestPart("file") MultipartFile file) {
        if (landDto.getUserId() == null) {
            throw new IllegalArgumentException("User ID must not be null");
        }

        User user = userRepository.findById(landDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // LandDTO'ya userId'yi set et
        landDto.setUserId(user.getId());

        // Land'ı kaydet ve DTO olarak döndür
        Land land = landService.saveLand(landDto, file);
        LandDTO savedLandDto = landService.getLandById(land.getId());
        return new ResponseEntity<>(savedLandDto, HttpStatus.CREATED);
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
    public ResponseEntity<LandDTO> updateLand(
            @PathVariable Long id,
            @RequestPart("land") LandDTO landDto,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        // Kullanıcıyı userId ile bul
        User user = userRepository.findById(landDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Kullanıcı ID'sini DTO'ya set et
        landDto.setUserId(user.getId());

        // Land'ı güncelle ve DTO olarak döndür
        Land updatedLand = landService.updateLand(id, landDto, file);
        LandDTO updatedLandDto = landService.getLandById(updatedLand.getId());
        return new ResponseEntity<>(updatedLandDto, HttpStatus.OK);
    }
}
