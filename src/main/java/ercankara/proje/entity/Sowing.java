package ercankara.proje.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Data
@Entity
@Table(name = "sowing")
public class Sowing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "plant_id", nullable = false)
    private Plant plant;

    @ManyToOne
    @JoinColumn(name = "land_id", nullable = false)
    @JsonBackReference  // Bu alan serileştirilirken görmezden gelinir
    private Land land;

    @Column(nullable = false)
    private LocalDate sowingDate;

    @Column(nullable = false)
    private int amount; // amount alanını ekleyin

    @OneToMany(mappedBy = "sowing", cascade = CascadeType.REMOVE)
    private List<Harvest> harvests;
}
