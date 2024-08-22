package ercankara.proje.repository;


import ercankara.proje.entity.Harvest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HarvestRepository extends JpaRepository<Harvest, Long> {
    // Gerekli özel sorgular buraya eklenebilir
}