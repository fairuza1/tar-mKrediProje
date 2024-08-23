package ercankara.proje.repository;

import ercankara.proje.entity.Harvest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HarvestRepository extends JpaRepository<Harvest, Long> {
    // Hasat ile ilgili özel sorgular burada tanımlanabilir
}
