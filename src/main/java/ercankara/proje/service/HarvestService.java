package ercankara.proje.service;

import ercankara.proje.entity.Harvest;
import ercankara.proje.repository.HarvestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HarvestService {
    private final HarvestRepository harvestRepository;

    @Autowired
    public HarvestService(HarvestRepository harvestRepository) {
        this.harvestRepository = harvestRepository;
    }

    public List<Harvest> getAllHarvests() {
        return harvestRepository.findAll();
    }

    public Harvest createHarvest(Harvest harvest) {
        return harvestRepository.save(harvest);
    }

    public void deleteHarvest(Long id) {
        harvestRepository.deleteById(id);
    }

    public Harvest getHarvestById(Long id) {
        return harvestRepository.findById(id).orElse(null); // Hasadı bul
    }
}