package com.smartparkinglot.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class StripeWebController {

    @GetMapping("/checkout")
    public String showPaymentForm() {
        return "checkout/checkout.html";
    }

    @GetMapping("/user/create-stripe-account")
    public String showOnboardingPage() {
        return "../stripeadmin/stripeadmin.html";
    }
}
