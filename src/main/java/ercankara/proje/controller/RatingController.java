package ercankara.proje.controller;

import ercankara.proje.dto.RatingDTO;
import ercankara.proje.entity.Rating;
import ercankara.proje.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        RatingDTO ratingDTO = ratingService.getRatingById(id); // 'getRatingById0' yerine 'getRatingById' olacak
        return new ResponseEntity<>(ratingDTO, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRating(@PathVariable Long id) {
        ratingService.deleteRating(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
