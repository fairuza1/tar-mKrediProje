package ercankara.proje.controller;

import ercankara.proje.dto.SowingDTO;
import ercankara.proje.service.SowingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/sowings")
@CrossOrigin(origins = "http://localhost:5173")
public class SowingController {

    @Autowired
    private SowingService sowingService;

    @PostMapping
    public SowingDTO createSowing(@RequestBody SowingDTO sowingDto) {
        return sowingService.saveSowing(sowingDto);
    }

    @GetMapping
    public List<SowingDTO> getAllSowings() {
        return sowingService.getAllSowings();
    }
}