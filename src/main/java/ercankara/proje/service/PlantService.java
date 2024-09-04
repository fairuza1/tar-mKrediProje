package ercankara.proje.service;

import ercankara.proje.dto.PlantDTO;
import ercankara.proje.entity.Category;
import ercankara.proje.entity.Plant;
import ercankara.proje.repository.CategoryRepository;
import ercankara.proje.repository.PlantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlantService {

    @Autowired
    private PlantRepository plantRepository;

    @Autowired
    private CategoryRepository categoryRepository; // Kategori repository'sini ekliyoruz

    public Plant savePlant(PlantDTO plantDto) {
        // Bitki oluşturulurken kategoriye de erişelim
        Category category = categoryRepository.findById(plantDto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + plantDto.getCategoryId()));

        Plant plant = new Plant();
        plant.setName(plantDto.getName());
        plant.setCategory(category); // Bitkiye kategori set edelim
        return plantRepository.save(plant);
    }

    public List<PlantDTO> getAllPlants() {
        return plantRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public List<PlantDTO> getPlantsByCategory(Long categoryId) {
        return plantRepository.findByCategoryId(categoryId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
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
        plantDto.setCategoryId(plant.getCategory().getId()); // Kategori ID
        plantDto.setCategoryName(plant.getCategory().getCategoryName()); // Kategori adı
        return plantDto;
    }
}
