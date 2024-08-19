package ercankara.proje.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

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
    private Land land;

    @Column(nullable = false)
    private LocalDate sowingDate;

    @Column(nullable = false)  // Add this line
    private int amount; // amount alanını ekleyin
}
