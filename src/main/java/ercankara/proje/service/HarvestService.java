package ercankara.proje.service;

import ercankara.proje.dto.HarvestDTO;
import ercankara.proje.entity.Harvest;
import ercankara.proje.repository.HarvestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HarvestService {
    private final HarvestRepository harvestRepository;

    @Autowired
    public HarvestService(HarvestRepository harvestRepository) {
        this.harvestRepository = harvestRepository;
    }

    public List<HarvestDTO> getAllHarvests() {
        return harvestRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public HarvestDTO createHarvest(HarvestDTO harvestDTO) {
        Harvest harvest = convertToEntity(harvestDTO);
        Harvest savedHarvest = harvestRepository.save(harvest);
        return convertToDTO(savedHarvest);
    }

    public void deleteHarvest(Long id) {
        harvestRepository.deleteById(id);
    }

    public HarvestDTO getHarvestById(Long id) {
        return harvestRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    private HarvestDTO convertToDTO(Harvest harvest) {
        HarvestDTO harvestDTO = new HarvestDTO();
        harvestDTO.setId(harvest.getId());
        harvestDTO.setHarvestDate(harvest.getHarvestDate());
        harvestDTO.setSowingId(harvest.getSowingId());
        return harvestDTO;
    }

    private Harvest convertToEntity(HarvestDTO harvestDTO) {
        Harvest harvest = new Harvest();
        harvest.setId(harvestDTO.getId());
        harvest.setHarvestDate(harvestDTO.getHarvestDate());
        harvest.setSowingId(harvestDTO.getSowingId());
        return harvest;
    }
}
