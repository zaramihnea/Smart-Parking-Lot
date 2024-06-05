package com.smartparkinglot.backend.configuration;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

@Configuration
@Order(3)
public class StripeConfig {

    private final Dotenv dotenv;

    @Autowired
    public StripeConfig(Dotenv dotenv) {
        this.dotenv = dotenv;
    }

    public String getApiKey() {
        return dotenv.get("STRIPE_API_KEY");
    }
}
