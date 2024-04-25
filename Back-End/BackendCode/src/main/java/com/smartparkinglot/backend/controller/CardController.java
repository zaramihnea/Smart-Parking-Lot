package com.smartparkinglot.backend.controller;

import com.smartparkinglot.backend.entity.Car;
import com.smartparkinglot.backend.entity.Card;
import com.smartparkinglot.backend.service.CarService;
import com.smartparkinglot.backend.service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/card")
public class CardController {
    private final CardService cardService;

    @Autowired
    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @GetMapping
    public List<Card> getCards(){
        return cardService.getAllCards();
    }

    @PostMapping
    public void registerNewCard(@RequestBody Card card) {
        cardService.addNewCard(card);
    }
}
