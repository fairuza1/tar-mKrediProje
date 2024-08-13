package ercankara.proje.controller;

import ercankara.proje.dto.PlantDTO;
import ercankara.proje.entity.Plant;
import ercankara.proje.service.PlantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/plants")
@CrossOrigin(origins = "http://localhost:5173")
public class PlantController {

    @Autowired
    private PlantService plantService;

    @PostMapping
    public Plant createPlant(@RequestBody PlantDTO plantDto) {
        Plant plant = new Plant();
        plant.setName(plantDto.getName());
        plant.setCategoryName(plantDto.getCategoryName());
        return plantService.savePlant(plant);
    }

    @GetMapping
    public List<PlantDTO> getAllPlants() {
        return plantService.getAllPlants();
    }

    @GetMapping("/detail/{id}")
    public PlantDTO getPlantById(@PathVariable Long id) {
        return plantService.getPlantById(id);
    }
}