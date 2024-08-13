package ercankara.proje.repository;

import ercankara.proje.entity.Land;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface LandRepository extends JpaRepository<Land, Long> {
    List<Land> findByUserId(Long userId);
}