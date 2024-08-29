package ercankara.proje.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "harvests")
public class Harvest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "harvest_date", nullable = false)
    private LocalDate harvestDate;

    @ManyToOne
    @JoinColumn(name = "sowing_id", nullable = false)
    @JsonManagedReference // Bu alan serileştirilirken referans olarak görünecek
    private Sowing sowing;
}
