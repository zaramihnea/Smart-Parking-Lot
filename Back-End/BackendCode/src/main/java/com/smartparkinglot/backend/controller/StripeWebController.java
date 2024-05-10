package com.smartparkinglot.backend.controller;

import com.smartparkinglot.backend.service.EmailService;
import com.smartparkinglot.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class StripeWebController {

    private final PaymentService paymentService;
    private final EmailService emailService;

    @Autowired
    public StripeWebController(PaymentService paymentService, EmailService emailService) {
        this.paymentService = paymentService;
        this.emailService = emailService;
    }
    @RequestMapping("/")
    public String home(Model model) {
        return "index.html";
    }

    @RequestMapping("/payment-success")
    public String paymentSuccess(Model model) {
        return "payment-success.html";
    }

    @GetMapping("/payment-complete")
    public String handleWebPaymentResult(@RequestParam("payment_intent") String paymentIntentId, RedirectAttributes redirectAttributes) {
        String result = paymentService.handlePaymentResult(paymentIntentId);
        if ("payment-success".equals(result)) {
            String customerEmail = paymentService.getCustomerEmail(paymentIntentId);
            emailService.sendConfirmationEmail(customerEmail);
            return "/payment-success.html";
        } else {
            return "/";
        }
    }

}
