package com.smartparkinglot.backend.service;

import com.smartparkinglot.backend.entity.Card;
import com.smartparkinglot.backend.entity.ParkingLot;
import com.smartparkinglot.backend.repository.CardRepository;
import com.smartparkinglot.backend.repository.ParkingLotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CardService {
    private final CardRepository cardRepository;

    @Autowired
    public CardService( CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    public List<Card> getAllCards() {
        return cardRepository.findAll();
    }

    public void addNewCard(Card card) {
        if (cardRepository.existsById(card.getId())) {
            throw new IllegalStateException("Card with ID " + card.getId() + " already exists");
        }
        cardRepository.save(card);
    }
}
