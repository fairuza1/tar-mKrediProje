package ercankara.proje.controller;

import ercankara.proje.dto.HarvestDTO;
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
    public ResponseEntity<List<HarvestDTO>> getAllHarvests() {
        List<HarvestDTO> harvests = harvestService.getAllHarvests();
        return new ResponseEntity<>(harvests, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<HarvestDTO> createHarvest(@RequestBody HarvestDTO harvestDTO) {
        HarvestDTO createdHarvest = harvestService.createHarvest(harvestDTO);
        return new ResponseEntity<>(createdHarvest, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHarvest(@PathVariable Long id) {
        HarvestDTO harvest = harvestService.getHarvestById(id);
        if (harvest == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            // Hasat ile ilişkili değerlendirmeleri sil
            ratingService.deleteRatingsByHarvestId(id);
            harvestService.deleteHarvest(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
