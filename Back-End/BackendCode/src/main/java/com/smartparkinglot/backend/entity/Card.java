package com.smartparkinglot.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cards")
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "card", length = 16)
    private String cardNumber;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "email", referencedColumnName = "email", foreignKey = @ForeignKey(name = "fk_cards_users"))
    private User user;

    public Card() {
    }

    public Card(Long id, String cardNumber, User user) {
        this.id = id;
        this.cardNumber = cardNumber;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
