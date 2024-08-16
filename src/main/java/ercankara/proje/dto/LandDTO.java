package ercankara.proje.dto;
import lombok.Data;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
public class LandDTO {
    private Long id;

    @NotNull(message = "Name cannot be null")
    @Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters")
    private String name;

    @NotNull(message = "Land size cannot be null")
    private int landSize;

    @NotNull(message = "City cannot be null")
    private String city;

    private String district;
    private String village;
    private String landType; // Land Type Değeri
    private Long userId; // User ID Değeri
}