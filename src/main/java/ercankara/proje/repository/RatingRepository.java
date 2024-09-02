package ercankara.proje.repository;

import ercankara.proje.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {
 List<Rating> findByHarvestId(Long harvestId); // Hasat ID'sine göre değerlendirmeleri bul
    List<Rating> findByHarvest_Sowing_Land_CityAndHarvest_Sowing_Land_District(String city, String district);

}
