package com.smartparkinglot.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "plates")
public class Plate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Getter
    @Column(name="plate", length = 7, nullable = false)
    private String plate;

    /**
     * Relatie many-to-one catre clasa User
     * De fiecare data cand se sterge un username din tabela 'users',
     * se va sterga si inregistrarile asociate acelui user din tabela 'plates'.
     */
    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "username", referencedColumnName = "username", nullable = false, foreignKey = @ForeignKey(name = "FK_plates_users"))
    private User user;

    //constructor implicit
    public Plate() {
    }

    public Plate(String plate, User user) {
        this.plate = plate;
        this.user = user;
    }
}
