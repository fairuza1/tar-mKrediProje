package ercankara.proje.service;

import ercankara.proje.dto.LandDTO;
import ercankara.proje.entity.Land;
import ercankara.proje.entity.User;
import ercankara.proje.repository.LandRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import ercankara.proje.repository.UserRepository;


import java.util.List;
import java.util.stream.Collectors;

@Service
public class LandService {

    @Autowired
    private LandRepository landRepository;

    @Autowired
    private UserRepository userRepository;

    public Land saveLand(Land land) {
        // Kullanıcıyı userId ile bul
        User user = userRepository.findById(land.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Arazi nesnesine User'ı set et
        land.setUser(user);

        // Başlangıçta remainingArea'yı landSize'a eşit yap
        land.setRemainingArea(land.getLandSize());

        // Land'ı kaydet
        return landRepository.save(land);
    }


    public List<LandDTO> getAllLands() {
        return landRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
    }
    public LandDTO getLandById(Long id) {
        Land land = landRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Land not found"));
        return convertToDto(land);
    }

    public Land updateLand(@PathVariable Long id, @Valid @RequestBody LandDTO landDto) {
        //verilen id ile veritabanından  mevcut araziyi bulmaya çalışır
        Land existingLand = landRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Land not found")); //Eğer arazi bulunamazsa, "Land not found" (Arazi bulunamadı) şeklinde bir hata fırlatılır.

        //? Bu kısımda, LandDTO nesnesinden gelen yeni veriler, mevcut arazi nesnesine (existingLand) set edilir.
        //? Böylece, güncellenmesi gereken bilgiler (isim, arazi boyutu, şehir, ilçe, köy) güncellenir.
        existingLand.setName(landDto.getName());
        existingLand.setLandSize(landDto.getLandSize());
        existingLand.setCity(landDto.getCity());
        existingLand.setDistrict(landDto.getDistrict());
        existingLand.setVillage(landDto.getVillage());
        existingLand.setLandType(landDto.getLandType()); // landType güncellemesi


        // Güncellenen kullanıcı bilgisi varsa, kullanıcıyı bulur ve set eder
        if (landDto.getUserId() != null) {
            User user = userRepository.findById(landDto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            existingLand.setUser(user);
        }

        // Güncellenen araziyi kaydeder ve döndürür
        return landRepository.save(existingLand);
    }

    public List<LandDTO> getLandsByUser(Long userId) {
        List<Land> lands = landRepository.findByUserId(userId);
        return lands.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private LandDTO convertToDto(Land land) {
        LandDTO landDto = new LandDTO();
        landDto.setId(land.getId());
        landDto.setName(land.getName());
        landDto.setLandSize(land.getLandSize());
        landDto.setCity(land.getCity());
        landDto.setDistrict(land.getDistrict());
        landDto.setVillage(land.getVillage());
        landDto.setUserId(land.getUser().getId());
        landDto.setLandType(land.getLandType()); // landType dönüştürülüyor

        return landDto;
    }
}