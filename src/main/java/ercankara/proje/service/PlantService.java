package ercankara.proje.service;

import ercankara.proje.dto.PlantDTO;
import ercankara.proje.entity.Plant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ercankara.proje.repository.PlantRepository;


import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlantService {

    @Autowired
    private PlantRepository plantRepository;

    public Plant savePlant(Plant plant) {
        return plantRepository.save(plant);
    }

    public List<PlantDTO> getAllPlants() {
        return plantRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public PlantDTO getPlantById(Long id) {
        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plant not found"));
        return convertToDto(plant);
    }

    private PlantDTO convertToDto(Plant plant) {
        PlantDTO plantDto = new PlantDTO();
        plantDto.setId(plant.getId());
        plantDto.setName(plant.getName());
        plantDto.setCategoryName(plant.getCategoryName());
        return plantDto;
    }
}