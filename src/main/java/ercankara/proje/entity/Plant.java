package ercankara.proje.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "plant")
public class Plant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;


    @OneToMany(mappedBy = "plant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Sowing> sowings;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category; //mappedBy'da kullanılan kısımdır.("plantCategory")
}