package ercankara.proje.service;

import ercankara.proje.dto.SowingDTO;
import ercankara.proje.entity.Land;
import ercankara.proje.entity.Plant;
import ercankara.proje.entity.Sowing;
import ercankara.proje.repository.LandRepository;
import ercankara.proje.repository.PlantRepository;
import ercankara.proje.repository.SowingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SowingService {
//sowingRepository: Ekim veritabanı işlemleri için SowingRepository sınıfına erişim sağlar. Ekim verilerini kaydetmek ve sorgulamak için kullanılır.
//plantRepository: Bitki veritabanı işlemleri için PlantRepository sınıfına erişim sağlar. Bitkilerle ilgili verileri sorgulamak için kullanılır.
//landRepository: Arazi veritabanı işlemleri için LandRepository sınıfına erişim sağlar. Arazilerle ilgili verileri sorgulamak ve güncellemek için kullanılır.
    @Autowired
    private SowingRepository sowingRepository;

    @Autowired
    private PlantRepository plantRepository;

    @Autowired
    private LandRepository landRepository;
//Bitki ve Arazi Kontrolü: Bu yöntem, ekim işlemini kaydetmeden önce, ekilecek bitki (Plant) ve arazinin (Land) mevcut olup olmadığını kontrol eder. Eğer bitki ya da arazi bulunamazsa, bir hata (RuntimeException) fırlatılır.
//Ekim Miktarı ve Kalan Alan Kontrolü: Kullanıcının ekmek istediği miktar (sowedAmount), arazide kalan alan (remainingSize) ile karşılaştırılır. Eğer ekilecek miktar, kalan alandan büyükse, yeterli alan olmadığını belirten bir hata fırlatılır.
//Ekim Kaydı: Eğer yeterli alan varsa, Sowing nesnesi oluşturulur ve ekim bilgileri bu nesneye set edilir. Bu bilgiler ekim tarihi, bitki, arazi ve ekim miktarını içerir.
//Kalan Alanın Güncellenmesi: Ekim işlemi tamamlandıktan sonra, arazinin kalan alanı güncellenir ve bu bilgi veritabanına kaydedilir.
//DTO Dönüşümü: Son olarak, kaydedilen ekim işlemi bir DTO'ya dönüştürülür ve bu DTO döndürülür.
    public SowingDTO saveSowing(SowingDTO sowingDto) {
        Plant plant = plantRepository.findById(sowingDto.getPlantId())
                .orElseThrow(() -> new RuntimeException("Plant not found"));

        Land land = landRepository.findById(sowingDto.getLandId())
                .orElseThrow(() -> new RuntimeException("Land not found"));

        int sowedAmount = sowingDto.getAmount();
        int remainingSize = land.getRemainingSize();

        if (sowedAmount > remainingSize) {
            throw new RuntimeException("Not enough space available.");
        }

        // Ekim işlemini kaydet
        Sowing sowing = new Sowing();
        sowing.setPlant(plant);
        sowing.setLand(land);
        sowing.setSowingDate(sowingDto.getSowingDate());
        sowing.setAmount(sowedAmount); // Ekim miktarını da ekleyin

        Sowing savedSowing = sowingRepository.save(sowing);

        // Kalan alanı güncelle
        land.setRemainingSize(remainingSize - sowedAmount);
        landRepository.save(land);

        return convertToDto(savedSowing);
    }

    public List<SowingDTO> getAllSowings() {
        return sowingRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public List<SowingDTO> getSowingsByUser(Long userId) {
        List<Sowing> sowings = sowingRepository.findByUserId(userId);
        return sowings.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private SowingDTO convertToDto(Sowing sowing) {
        SowingDTO sowingDto = new SowingDTO();
        sowingDto.setId(sowing.getId());
        sowingDto.setPlantId(sowing.getPlant().getId());
        sowingDto.setPlantName(sowing.getPlant().getName()); // Bitki adı ekleniyor
        sowingDto.setLandId(sowing.getLand().getId());
        sowingDto.setLandName(sowing.getLand().getName()); // Arazi adı ekleniyor
        sowingDto.setSowingDate(sowing.getSowingDate());
        sowingDto.setAmount(sowing.getAmount()); // Ekim miktarını ekleyin
        return sowingDto;
    }
}
