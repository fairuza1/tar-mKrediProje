package ercankara.proje.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class SowingDTO {
    private Long id;

    @NotNull(message = "Plant ID cannot be null")
    private Long plantId;

    private String plantName;

    @NotNull(message = "Land ID cannot be null")
    private Long landId;

    private String landName;

    // Kategori bilgisi ekleniyor
    private Long categoryId;      // Yeni kategori ID alanı
    private String categoryName;  // Yeni kategori adı alanı

    @NotNull(message = "Sowing date cannot be null")
    private LocalDate sowingDate;

    @NotNull(message = "Amount cannot be null")
    private Integer amount;
}
