package com.smartparkinglot.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp; // Use Timestamp for precise time handling

@Entity
@Table(name = "tokens")
public class Token {
    @Id
    @Getter @Setter
    @Column(name = "token", length = 200, nullable = false)
    private String token;

    @Getter @Setter
    @ManyToOne
    @JoinColumn(name = "username", referencedColumnName = "username", foreignKey = @ForeignKey(name = "fk_tokens_users"))
    private User user;

    @Getter @Setter
    @Column(nullable = false)
    private Timestamp creationDate; // Changed to Timestamp for date and time

    @Getter @Setter
    @Column(nullable = false)
    private Timestamp expirationDate; // Changed to Timestamp for date and time

    public Token() {
    }

    public Token(String token, User user, Timestamp creationDate, Timestamp expirationDate) {
        this.token = token;
        this.user = user;
        this.creationDate = creationDate;
        this.expirationDate = expirationDate;
    }
}
