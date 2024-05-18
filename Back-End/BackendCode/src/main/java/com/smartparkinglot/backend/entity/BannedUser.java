package com.smartparkinglot.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "banned_users")
public class BannedUser {
    @Getter @Setter
    @Id
    private String email;
}
