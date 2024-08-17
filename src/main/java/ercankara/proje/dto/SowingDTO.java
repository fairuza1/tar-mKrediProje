package ercankara.proje.dto;

import lombok.Data;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class    SowingDTO {
    private Long id;

    @NotNull(message = "Plant ID cannot be null")
    private Long plantId;

    private String plantName;

    private int amount;

    @NotNull(message = "Land ID cannot be null")
    private Long landId;

    private String landName;

    @NotNull(message = "Sowing date cannot be null")
    private LocalDate sowingDate;
}