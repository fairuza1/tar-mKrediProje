package ercankara.proje.repository;

import ercankara.proje.entity.Plant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlantRepository extends JpaRepository<Plant, Long> {
    List<Plant> findByCategoryId(Long categoryId);
}