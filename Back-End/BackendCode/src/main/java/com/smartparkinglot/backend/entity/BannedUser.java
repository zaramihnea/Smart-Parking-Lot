package com.smartparkinglot.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "banned_users")
public class BannedUser {
    @Getter @Setter
    @ManyToOne
    @Id
    @JoinColumn(name = "email", referencedColumnName = "email", foreignKey = @ForeignKey(name = "fk_tokens_users"), unique = true, nullable = false)
    private User user;
}
