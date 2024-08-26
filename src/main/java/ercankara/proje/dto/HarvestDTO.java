package ercankara.proje.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class HarvestDTO {
    private Long id;
    private LocalDate harvestDate;
    private Long sowingId;
}
