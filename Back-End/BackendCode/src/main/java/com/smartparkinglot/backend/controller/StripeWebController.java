package com.smartparkinglot.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class StripeWebController {

    @Value("${stripe.apiKey}")
    String stripeKey;

    @RequestMapping("/")
    public String home(Model model) {
        return "/index.html";
    }
}
