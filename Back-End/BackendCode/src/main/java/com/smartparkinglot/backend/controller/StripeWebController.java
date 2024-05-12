package com.smartparkinglot.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class StripeWebController {

    @GetMapping("/")
    public String showPaymentForm(Model model) {
        return "index.html";
    }
}
