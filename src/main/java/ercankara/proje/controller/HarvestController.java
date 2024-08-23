package ercankara.proje.controller;

import ercankara.proje.entity.Harvest;
import ercankara.proje.entity.Rating;
import ercankara.proje.service.HarvestService;
import ercankara.proje.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/harvests")
public class HarvestController {
    private final HarvestService harvestService;
    private final RatingService ratingService;

    @Autowired
    public HarvestController(HarvestService harvestService, RatingService ratingService) {
        this.harvestService = harvestService;
        this.ratingService = ratingService;
    }

    @GetMapping
    public ResponseEntity<List<Harvest>> getAllHarvests() {
        List<Harvest> harvests = harvestService.getAllHarvests();
        return new ResponseEntity<>(harvests, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Harvest> createHarvest(@RequestBody Harvest harvest) {
        Harvest createdHarvest = harvestService.createHarvest(harvest);
        return new ResponseEntity<>(createdHarvest, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHarvest(@PathVariable Long id) {
        Harvest harvest = harvestService.findById(id);
        if (harvest == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            // Hasat ile ilişkili değerlendirmeleri sil
            List<Rating> ratings = ratingService.findByHarvestId(id);
            for (Rating rating : ratings) {
                ratingService.deleteRating(rating.getId());
            }
            harvestService.deleteHarvest(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
