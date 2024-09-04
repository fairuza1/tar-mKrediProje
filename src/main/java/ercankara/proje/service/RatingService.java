package ercankara.proje.service;

import ercankara.proje.dto.RatingDTO;
import ercankara.proje.entity.Harvest;
import ercankara.proje.entity.Plant;
import ercankara.proje.entity.Rating;
import ercankara.proje.repository.HarvestRepository;
import ercankara.proje.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
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

        // Ürün ilk defa mı değerlendiriliyor, kontrol edelim
        boolean isFirstEvaluation = isFirstEvaluation(ratingDTO.getHarvestId());

        if (isFirstEvaluation) {
            // İlk değerlendirme için özel puanlama
            if (ratingDTO.getHarvestCondition() >= 4.5) {
                rating.setOverallRating(4); // Çok iyi
            } else if (ratingDTO.getHarvestCondition() >= 3.5) {
                rating.setOverallRating(3); // İyi
            } else if (ratingDTO.getHarvestCondition() >= 2.5) {
                rating.setOverallRating(2.5); // Ne iyi ne kötü
            } else if (ratingDTO.getHarvestCondition() >= 1.5) {
                rating.setOverallRating(2); // Kötü
            } else {
                rating.setOverallRating(1); // Çok kötü
            }
        } else {
            // Daha önce değerlendirilmişse, 1-5 arasında tam puanlama yap
            double average = (ratingDTO.getHarvestCondition() + ratingDTO.getProductQuality()) / 2.0;
            rating.setOverallRating(average);
        }

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
        double yieldPerSquareMeter = rating.getProductQuantity() / landSize;

        ratingDTO.setYieldPerSquareMeter(yieldPerSquareMeter); // Metrekare başına düşen ürün miktarını DTO'ya ekle
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

    // Her bitki için metrekare başına düşen ürün miktarını hesaplama
    public Map<String, Double> calculateYieldPerSquareMeterByPlant(String city, String district) {
        List<Rating> ratings = ratingRepository.findByHarvest_Sowing_Land_CityAndHarvest_Sowing_Land_District(city, district);

        Map<String, Double> totalProductQuantities = new HashMap<>();
        Map<String, Double> totalSownAreas = new HashMap<>();

        for (Rating rating : ratings) {
            String plantName = rating.getHarvest().getSowing().getPlant().getName();

            totalProductQuantities.put(plantName, totalProductQuantities.getOrDefault(plantName, 0.0) + rating.getProductQuantity());
            totalSownAreas.put(plantName, totalSownAreas.getOrDefault(plantName, 0.0) + rating.getHarvest().getSowing().getAmount());
        }

        Map<String, Double> yieldPerSquareMeterByPlant = new HashMap<>();
        for (String plantName : totalProductQuantities.keySet()) {
            double totalQuantity = totalProductQuantities.get(plantName);
            double totalArea = totalSownAreas.get(plantName);
            yieldPerSquareMeterByPlant.put(plantName, totalArea > 0 ? totalQuantity / totalArea : 0.0);
        }

        return yieldPerSquareMeterByPlant;
    }
    public boolean isFirstEvaluation(Long harvestId) {
        // Hasat ID'sine göre daha önce değerlendirme yapılmış mı kontrol et
        List<Rating> ratings = ratingRepository.findByHarvestId(harvestId);
        return ratings.isEmpty(); // Eğer boşsa, bu hasat için ilk değerlendirme yapılıyor demektir
    }
}
