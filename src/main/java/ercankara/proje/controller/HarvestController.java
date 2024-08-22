package ercankara.proje.controller;

import ercankara.proje.entity.Harvest;
import ercankara.proje.service.HarvestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/harvests")
public class HarvestController {
    private final HarvestService harvestService;

    @Autowired
    public HarvestController(HarvestService harvestService) {
        this.harvestService = harvestService;
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
        Harvest harvest = harvestService.getHarvestById(id); // Hasadı bul
        if (harvest == null) {
            return ResponseEntity.notFound().build(); // Hasat bulunamazsa 404 döndür
        }
        harvestService.deleteHarvest(id); // Hasadı sil
        return ResponseEntity.noContent().build(); // Başarılı silme için 204 döndür
    }
}

