package ercankara.proje.service;

import ercankara.proje.dto.RatingDTO;
import ercankara.proje.entity.Harvest;
import ercankara.proje.entity.Rating;
import ercankara.proje.repository.HarvestRepository;
import ercankara.proje.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
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

    private RatingDTO convertToDTO(Rating rating) {
        RatingDTO ratingDTO = new RatingDTO();
        ratingDTO.setId(rating.getId());
        ratingDTO.setHarvestId(rating.getHarvest().getId());
        ratingDTO.setHarvestCondition(rating.getHarvestCondition());
        ratingDTO.setProductQuality(rating.getProductQuality());
        ratingDTO.setProductQuantity(rating.getProductQuantity());
        ratingDTO.setOverallRating(rating.getOverallRating());
        return ratingDTO;
    }
    public void deleteRatingsByHarvestId(Long harvestId) {
        List<Rating> ratings = findByHarvestId(harvestId);
        for (Rating rating : ratings) {
            deleteRating(rating.getId());
        }
    }
}
