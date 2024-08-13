package ercankara.proje.repository;

import ercankara.proje.entity.Plant;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PlantRepository extends JpaRepository<Plant, Long> {
    Plant findByName(String name);
}