package ercankara.proje.service;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ercankara.proje.dto.LandDTO;
import ercankara.proje.entity.Land;
import ercankara.proje.entity.User;
import ercankara.proje.repository.LandRepository;
import ercankara.proje.repository.UserRepository;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LandService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    private LandRepository landRepository;

    @Autowired
    private UserRepository userRepository;

    public Land saveLand(LandDTO landDto, MultipartFile imageFile) {
        User user = userRepository.findById(landDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Land land = new Land();
        land.setName(landDto.getName());
        land.setLandSize(landDto.getLandSize());
        land.setCity(landDto.getCity());
        land.setDistrict(landDto.getDistrict());
        land.setVillage(landDto.getVillage());
        land.setLandType(landDto.getLandType());
        land.setUser(user);
        land.setRemainingArea(landDto.getLandSize());

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = uploadImage(imageFile);
            land.setImage(imageUrl);
        }

        return landRepository.save(land);
    }

    public Land updateLand(Long id, @Valid LandDTO landDto, MultipartFile file) {
        Land existingLand = landRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Land not found"));

        existingLand.setName(landDto.getName());
        existingLand.setLandSize(landDto.getLandSize());
        existingLand.setCity(landDto.getCity());
        existingLand.setDistrict(landDto.getDistrict());
        existingLand.setVillage(landDto.getVillage());
        existingLand.setLandType(landDto.getLandType());

        if (landDto.getUserId() != null) {
            User user = userRepository.findById(landDto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            existingLand.setUser(user);
        }

        if (file != null && !file.isEmpty()) {
            String imageUrl = uploadImage(file);
            existingLand.setImage(imageUrl);
        }

        return landRepository.save(existingLand);
    }

    private String uploadImage(MultipartFile file) {
        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path path = Paths.get(uploadDir + File.separator + fileName);
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());
            return "../../src/assets/LandList/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store image", e);
        }
    }

    public List<LandDTO> getLandsByUser(Long userId) {
        List<Land> lands = landRepository.findByUserId(userId);
        return lands.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public LandDTO getLandById(Long id) {
        Land land = landRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Land not found"));
        return convertToDto(land);
    }

    private LandDTO convertToDto(Land land) {
        LandDTO landDto = new LandDTO();
        landDto.setId(land.getId());
        landDto.setName(land.getName());
        landDto.setLandSize(land.getLandSize());
        landDto.setCity(land.getCity());
        landDto.setDistrict(land.getDistrict());
        landDto.setVillage(land.getVillage());
        landDto.setLandType(land.getLandType());
        landDto.setUserId(land.getUser().getId());
        landDto.setRemainingArea(land.getRemainingArea());
        landDto.setImageUrl(land.getImage());
        return landDto;
    }
}
