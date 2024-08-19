package ercankara.proje.service;

import ercankara.proje.dto.SowingDTO;
import ercankara.proje.entity.Sowing;
import ercankara.proje.entity.Plant;
import ercankara.proje.entity.Land;
import ercankara.proje.repository.SowingRepository;
import ercankara.proje.repository.PlantRepository;
import ercankara.proje.repository.LandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SowingService {

    @Autowired
    private SowingRepository sowingRepository;

    @Autowired
    private PlantRepository plantRepository;

    @Autowired
    private LandRepository landRepository;

    public SowingDTO saveSowing(SowingDTO sowingDto) {
        // Plant ve Land nesnelerini veritabanından al
        Optional<Plant> plantOptional = plantRepository.findById(sowingDto.getPlantId());
        Optional<Land> landOptional = landRepository.findById(sowingDto.getLandId());

        if (!plantOptional.isPresent()) {
            throw new RuntimeException("Plant not found with ID: " + sowingDto.getPlantId());
        }
        if (!landOptional.isPresent()) {
            throw new RuntimeException("Land not found with ID: " + sowingDto.getLandId());
        }

        // Sowing nesnesini oluşturun ve set edin
        Sowing sowing = new Sowing();
        sowing.setPlant(plantOptional.get());
        sowing.setLand(landOptional.get());
        sowing.setSowingDate(sowingDto.getSowingDate());
        sowing.setAmount(sowingDto.getAmount()); // Amount'ı set edin

        sowing = sowingRepository.save(sowing);
        return convertToDto(sowing);
    }

    public List<SowingDTO> getSowingsByUser(Long userId) {
        return sowingRepository.findByLandUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private SowingDTO convertToDto(Sowing sowing) {
        SowingDTO dto = new SowingDTO();
        dto.setId(sowing.getId());
        dto.setPlantId(sowing.getPlant().getId());
        dto.setPlantName(sowing.getPlant().getName()); // Bu yöntemlerin doğru olduğundan emin olun
        dto.setLandId(sowing.getLand().getId());
        dto.setLandName(sowing.getLand().getName()); // Bu yöntemlerin doğru olduğundan emin olun
        dto.setSowingDate(sowing.getSowingDate());
        dto.setAmount(sowing.getAmount()); // Amount'u set edin
        return dto;
    }
}
