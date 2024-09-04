package ercankara.proje.controller;

import ercankara.proje.dto.RatingDTO;
import ercankara.proje.entity.Rating;
import ercankara.proje.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {
    private final RatingService ratingService;

    @Autowired
    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public ResponseEntity<Rating> createRating(@RequestBody RatingDTO ratingDTO) {
        try {
            Rating rating = ratingService.createRating(ratingDTO);
            return new ResponseEntity<>(rating, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<RatingDTO>> getAllRatings() {
        List<RatingDTO> ratings = ratingService.getAllRatings();
        return new ResponseEntity<>(ratings, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RatingDTO> getRatingById(@PathVariable Long id) {
        RatingDTO ratingDTO = ratingService.getRatingById(id);
        return new ResponseEntity<>(ratingDTO, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRating(@PathVariable Long id) {
        ratingService.deleteRating(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Belirli bir şehir ve ilçe için bitki önerileri
    @GetMapping("/recommendations")
    public ResponseEntity<Map<String, Double>> getRecommendations(@RequestParam String city, @RequestParam String district) {
        Map<String, Double> recommendations = ratingService.getPlantRecommendationsByHarvestLocation(city, district);
        return new ResponseEntity<>(recommendations, HttpStatus.OK);
    }

    // Belirli bir şehir ve ilçe için her bitkiye özel metrekare başına düşen ürün miktarını döndürür
    @GetMapping("/yield-per-square-meter-by-plant")
    public ResponseEntity<Map<String, Double>> getYieldPerSquareMeterByPlant(
            @RequestParam String city,
            @RequestParam String district) {
        Map<String, Double> yieldPerSquareMeterByPlant = ratingService.calculateYieldPerSquareMeterByPlant(city, district);
        return new ResponseEntity<>(yieldPerSquareMeterByPlant, HttpStatus.OK);
    }
    @GetMapping("/isFirstEvaluation/{harvestId}")
    public ResponseEntity<Map<String, Boolean>> isFirstEvaluation(@PathVariable Long harvestId) {
        boolean isFirstEvaluation = ratingService.isFirstEvaluation(harvestId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isFirstEvaluation", isFirstEvaluation);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
