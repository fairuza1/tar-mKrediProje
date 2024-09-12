package ercankara.proje.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "land")
public class Land {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(nullable = false, length = 50)
    String name;
    @Column(nullable = false)
    int landSize;
    @Column(nullable = false)
    String city;
    @Column(nullable = false)
    String district;
    private String landType;
    String village;

    @Column(nullable = false)
    private int remainingArea;

    @Column(nullable = true)
    String image; // Resim URL'si için alan

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference("user-land")
    private User user;

    @OneToMany(mappedBy = "land", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("land-sowing")
    @JsonManagedReference
    private List<Sowing> sowings;
}
