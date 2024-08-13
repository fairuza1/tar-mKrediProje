package ercankara.proje.dto;

import lombok.Data;

import jakarta.validation.constraints.NotNull;

@Data
public class PlantDTO {
    private Long id;

    @NotNull(message = "Name cannot be null")
    private String name;

    @NotNull(message = "Category name cannot be null")
    private String categoryName;
}