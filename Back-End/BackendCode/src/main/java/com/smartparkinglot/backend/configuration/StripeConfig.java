package com.smartparkinglot.backend.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

@Configuration
@Order(3)
public class StripeConfig {
    @Value("${stripe.apiKey}")
    private String apiKey;

    public String getApiKey() {
        return apiKey;
    }
}
