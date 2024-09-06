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

        // Arazi miktarını kontrol et
        Land land = landOptional.get();
        int availableLand = land.getRemainingArea(); // remainingArea kullan

        // Ekim miktarını kontrol et
        if (sowingDto.getAmount() <= 0) {
            throw new RuntimeException("Ekim miktarı sıfır veya negatif olamaz.");
        }

        // Ekim miktarı mevcut arazi alanından fazla olmamalı
        if (sowingDto.getAmount() > availableLand) {
            throw new RuntimeException("Ekim miktarı mevcut arazi alanını aşıyor. Mevcut: " + availableLand);
        }

        // Sowing nesnesini oluşturun ve set edin
        Sowing sowing = new Sowing();
        sowing.setPlant(plantOptional.get());
        sowing.setLand(land);
        sowing.setSowingDate(sowingDto.getSowingDate());
        sowing.setAmount(sowingDto.getAmount());

        // Sowing nesnesini kaydet
        sowing = sowingRepository.save(sowing);

        // remainingArea'yi güncelle
        int newRemainingArea = availableLand - sowingDto.getAmount();
        land.setRemainingArea(newRemainingArea < 0 ? 0 : newRemainingArea); // Boş alan sıfırın altına düşmemeli
        landRepository.save(land); // Land nesnesini kaydet

        return convertToDto(sowing);
    }

    public List<SowingDTO> getSowingsByUser(Long userId) {
        return sowingRepository.findByLandUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public SowingDTO getSowingById(Long id) {
        Sowing sowing = sowingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sowing not found"));
        return convertToDto(sowing);
    }

    public Sowing updateSowing(Long id, SowingDTO sowingDTO) {
        Sowing existingSowing = sowingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sowing not found"));

        // Mevcut arazideki remainingArea'yi eski ekim miktarını geri ekleyerek güncelle
        Land land = existingSowing.getLand();
        int currentRemainingArea = land.getRemainingArea();
        land.setRemainingArea(currentRemainingArea + existingSowing.getAmount()); // Eski ekim miktarını geri ekliyoruz

        // Yeni ekim miktarını kontrol ediyoruz
        if (sowingDTO.getAmount() <= 0) {
            throw new RuntimeException("Ekim miktarı sıfır veya negatif olamaz.");
        }
        if (sowingDTO.getAmount() > land.getRemainingArea()) {
            throw new RuntimeException("Yeni ekim miktarı mevcut arazi alanını aşıyor. Mevcut: " + land.getRemainingArea());
        }

        // Yeni ekim miktarını kalan alandan çıkarıyoruz
        land.setRemainingArea(land.getRemainingArea() - sowingDTO.getAmount());

        // Güncellemeleri Sowing nesnesine uygula
        existingSowing.setSowingDate(sowingDTO.getSowingDate());
        existingSowing.setAmount(sowingDTO.getAmount());

        // Eğer arazi veya bitki değişiyorsa, gerekli güncellemeleri yap
        if (sowingDTO.getLandId() != null && !sowingDTO.getLandId().equals(existingSowing.getLand().getId())) {
            Land newLand = landRepository.findById(sowingDTO.getLandId())
                    .orElseThrow(() -> new RuntimeException("Land not found"));
            existingSowing.setLand(newLand);
        }

        if (sowingDTO.getPlantId() != null && !sowingDTO.getPlantId().equals(existingSowing.getPlant().getId())) {
            Plant plant = plantRepository.findById(sowingDTO.getPlantId())
                    .orElseThrow(() -> new RuntimeException("Plant not found"));
            existingSowing.setPlant(plant);
        }

        landRepository.save(land);  // Arazideki kalan alanı güncelle
        return sowingRepository.save(existingSowing);  // Ekim güncellemesini kaydediyoruz
    }

    public int getAvailableLand(Long landId) {
        Land land = landRepository.findById(landId)
                .orElseThrow(() -> new RuntimeException("Land not found"));
        return land.getRemainingArea();
    }

    private SowingDTO convertToDto(Sowing sowing) {
        SowingDTO dto = new SowingDTO();
        dto.setId(sowing.getId());
        dto.setPlantId(sowing.getPlant().getId());
        dto.setPlantName(sowing.getPlant().getName());

        // Kategori bilgisi ekleniyor
        dto.setCategoryId(sowing.getPlant().getCategory().getId());
        dto.setCategoryName(sowing.getPlant().getCategory().getCategoryName());

        dto.setLandId(sowing.getLand().getId());
        dto.setLandName(sowing.getLand().getName());
        dto.setSowingDate(sowing.getSowingDate());
        dto.setAmount(sowing.getAmount());

        return dto;
    }

    public void deleteSowing(Long id) {
        Sowing sowing = sowingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sowing not found"));

        // Ekim kaydını silmeden önce, arazi alanını güncelle
        Land land = sowing.getLand();
        int updatedRemainingArea = land.getRemainingArea() + sowing.getAmount();
        land.setRemainingArea(updatedRemainingArea);
        landRepository.save(land); // Land nesnesini kaydet

        // Ekim kaydını sil
        sowingRepository.delete(sowing);
    }
}
