package ercankara.proje.repository;

import ercankara.proje.entity.Sowing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;

public interface SowingRepository extends JpaRepository<Sowing, Long> {

    @Query("SELECT s FROM Sowing s WHERE s.land.user.id = :userId")
    List<Sowing> findByUserId(@Param("userId") Long userId);

    List<Sowing> findByLandUserId(Long userId);

}