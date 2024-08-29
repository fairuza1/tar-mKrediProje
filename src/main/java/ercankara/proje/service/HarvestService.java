package ercankara.proje.service;

import ercankara.proje.dto.HarvestDTO;
import ercankara.proje.entity.Harvest;
import ercankara.proje.entity.Sowing;
import ercankara.proje.repository.HarvestRepository;
import ercankara.proje.repository.SowingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HarvestService {
    private final HarvestRepository harvestRepository;
    private final SowingRepository sowingRepository;

    @Autowired
    public HarvestService(HarvestRepository harvestRepository, SowingRepository sowingRepository) {
        this.harvestRepository = harvestRepository;
        this.sowingRepository = sowingRepository;
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
        if (harvest.getSowing() != null) {
            harvestDTO.setSowingId(harvest.getSowing().getId());
        }
        return harvestDTO;
    }

    private Harvest convertToEntity(HarvestDTO harvestDTO) {
        Harvest harvest = new Harvest();
        harvest.setId(harvestDTO.getId());
        harvest.setHarvestDate(harvestDTO.getHarvestDate());

        if (harvestDTO.getSowingId() != null) {
            Sowing sowing = sowingRepository.findById(harvestDTO.getSowingId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid sowing ID: " + harvestDTO.getSowingId()));
            harvest.setSowing(sowing);
        }

        return harvest;
    }
}
