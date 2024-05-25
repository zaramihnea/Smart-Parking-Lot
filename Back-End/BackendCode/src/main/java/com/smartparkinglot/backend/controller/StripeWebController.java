package com.smartparkinglot.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class StripeWebController {

    @GetMapping("/checkout")
    public String showPaymentForm() {
        return "index.html";
    }
}
