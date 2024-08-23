package ercankara.proje.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingDTO {
    private Long id;
    private Long harvestId; // İlgili hasat ID'si (gerekli olacak)
    private int harvestCondition; // 1-5 arası
    private int productQuality;    // 1-5 arası
    private double productQuantity; // kg cinsinden
    private double overallRating;   // Genel değerlendirme
}