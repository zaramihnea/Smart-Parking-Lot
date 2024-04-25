package com.smartparkinglot.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tokens")
public class Token {
    @Id
    @Column(name = "token", length = 200)
    private String token;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "username", referencedColumnName = "username", foreignKey = @ForeignKey(name = "fk_tokens_users"))
    private User user;

    public Token() {
    }

    public Token(String token, User user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
