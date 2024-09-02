package ercankara.proje.service;

import ercankara.proje.dto.RatingDTO;
import ercankara.proje.entity.Harvest;
import ercankara.proje.entity.Plant;
import ercankara.proje.entity.Rating;
import ercankara.proje.repository.HarvestRepository;
import ercankara.proje.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
public class RatingService {
    private final RatingRepository ratingRepository;
    private final HarvestRepository harvestRepository;

    @Autowired
    public RatingService(RatingRepository ratingRepository, HarvestRepository harvestRepository) {
        this.ratingRepository = ratingRepository;
        this.harvestRepository = harvestRepository;
    }

    // Hasat ID'sine göre değerlendirmeleri bul
    public List<Rating> findByHarvestId(Long harvestId) {
        return ratingRepository.findByHarvestId(harvestId);
    }

    public Rating createRating(RatingDTO ratingDTO) {
        Harvest harvest = harvestRepository.findById(ratingDTO.getHarvestId())
                .orElseThrow(() -> new RuntimeException("Harvest not found"));

        Rating rating = new Rating();
        rating.setHarvest(harvest);
        rating.setHarvestCondition(ratingDTO.getHarvestCondition());
        rating.setProductQuality(ratingDTO.getProductQuality());
        rating.setProductQuantity(ratingDTO.getProductQuantity());
        rating.setOverallRating(ratingDTO.getOverallRating());

        return ratingRepository.save(rating);
    }

    public List<RatingDTO> getAllRatings() {
        return ratingRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public RatingDTO getRatingById(Long id) {
        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rating not found"));
        return convertToDTO(rating);
    }

    public void deleteRating(Long id) {
        ratingRepository.deleteById(id);
    }

    public void deleteRatingsByHarvestId(Long harvestId) {
        List<Rating> ratings = findByHarvestId(harvestId);
        for (Rating rating : ratings) {
            deleteRating(rating.getId());
        }
    }

    private RatingDTO convertToDTO(Rating rating) {
        RatingDTO ratingDTO = new RatingDTO();
        ratingDTO.setId(rating.getId());
        ratingDTO.setHarvestId(rating.getHarvest().getId());
        ratingDTO.setHarvestCondition(rating.getHarvestCondition());
        ratingDTO.setProductQuality(rating.getProductQuality());
        ratingDTO.setProductQuantity(rating.getProductQuantity());
        ratingDTO.setOverallRating(rating.getOverallRating());
        double landSize = rating.getHarvest().getSowing().getLand().getLandSize();
        ratingDTO.setYieldPerSquareMeter(rating.getProductQuantity() / landSize); // Metrekare başına düşen ürün miktarını hesaplayıp DTO'ya ekle
        return ratingDTO;
    }

    // Belirli bir şehir ve ilçe için bitki önerileri
    public Map<String, Double> getPlantRecommendationsByHarvestLocation(String city, String district) {
        // Belirli şehir ve ilçe için değerlendirmeleri al
        List<Rating> ratings = ratingRepository.findByHarvest_Sowing_Land_CityAndHarvest_Sowing_Land_District(city, district);

        // Bitkiler için puan hesaplama
        Map<String, List<Double>> plantScoresMap = new HashMap<>();
        for (Rating rating : ratings) {
            Plant plant = rating.getHarvest().getSowing().getPlant();
            String plantName = plant.getName();
            double score = rating.getOverallRating();

            // Bitkilerin tüm değerlendirme puanlarını liste halinde sakla
            plantScoresMap.computeIfAbsent(plantName, k -> new ArrayList<>()).add(score);
        }

        // Bitkiler için ortalama hesaplama ve maksimum 5 olacak şekilde sınırlama
        Map<String, Double> plantScores = new HashMap<>();
        for (Map.Entry<String, List<Double>> entry : plantScoresMap.entrySet()) {
            String plantName = entry.getKey();
            List<Double> scores = entry.getValue();

            // Ortalama hesaplama
            double averageScore = scores.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
            // 5'e sınırlama
            averageScore = Math.min(averageScore, 5.0);

            plantScores.put(plantName, averageScore);
        }

        return plantScores;
    }

    // Tüm arazilerin toplam ürün miktarını ve ekilen alanı kullanarak metrekare başına düşen ürün miktarını hesaplama
    public double calculateYieldPerSquareMeter(String city, String district) {
        List<Rating> ratings = ratingRepository.findByHarvest_Sowing_Land_CityAndHarvest_Sowing_Land_District(city, district);

        double totalProductQuantity = 0.0;
        double totalSownArea = 0.0;

        for (Rating rating : ratings) {
            totalProductQuantity += rating.getProductQuantity();
            totalSownArea += rating.getHarvest().getSowing().getAmount(); // Ekilen alan miktarı
        }

        // Metrekare başına düşen ürün miktarını hesapla
        return totalSownArea > 0 ? totalProductQuantity / totalSownArea : 0.0;
    }
}
