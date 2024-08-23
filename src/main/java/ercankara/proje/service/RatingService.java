package ercankara.proje.service;

import ercankara.proje.dto.RatingDTO;
import ercankara.proje.entity.Rating;
import ercankara.proje.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RatingService {
    private final RatingRepository ratingRepository;

    @Autowired
    public RatingService(RatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
    }

    public Rating createRating(RatingDTO ratingDTO) {
        Rating rating = new Rating();
        rating.setHarvestId(ratingDTO.getHarvestId());
        rating.setHarvestCondition(ratingDTO.getHarvestCondition());
        rating.setProductQuality(ratingDTO.getProductQuality());
        rating.setProductQuantity(ratingDTO.getProductQuantity());
        rating.setOverallRating(ratingDTO.getOverallRating());

        return ratingRepository.save(rating);
    }

    public List<RatingDTO> getAllRatings() {
        return ratingRepository.findAll().stream()
                .map(rating -> {
                    RatingDTO ratingDTO = new RatingDTO();
                    ratingDTO.setHarvestId(rating.getHarvestId());
                    ratingDTO.setHarvestCondition(rating.getHarvestCondition());
                    ratingDTO.setProductQuality(rating.getProductQuality());
                    ratingDTO.setProductQuantity(rating.getProductQuantity());
                    ratingDTO.setOverallRating(rating.getOverallRating());
                    return ratingDTO;
                })
                .collect(Collectors.toList());
    }
}
