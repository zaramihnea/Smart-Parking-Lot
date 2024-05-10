package com.smartparkinglot.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendConfirmationEmail(String userEmail) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("contact.smartparkinglot@gmail.com");
            message.setTo(userEmail);
            message.setSubject("Payment Confirmation");
            message.setText("Thank you for your payment. Your payment has been successfully processed.");
            mailSender.send(message);
        } catch (MailException e) {
            log.error("Error sending email: " + e.getMessage());
        }
    }

}
