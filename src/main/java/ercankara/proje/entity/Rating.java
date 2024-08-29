package ercankara.proje.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ratings")
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int harvestCondition; // 1-5 arası
    private int productQuality;    // 1-5 arası
    private double productQuantity; // kg cinsinden
    private double overallRating;   // Genel değerlendirme

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "harvest_id", nullable = false)
    private Harvest harvest;
}