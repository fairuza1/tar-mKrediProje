package ercankara.proje.controller;

import ercankara.proje.dto.SowingDTO;
import ercankara.proje.entity.User;
import ercankara.proje.service.SowingService;
import ercankara.proje.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public SowingDTO createSowing(@RequestBody SowingDTO sowingDto) {
        return sowingService.saveSowing(sowingDto);
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
}
