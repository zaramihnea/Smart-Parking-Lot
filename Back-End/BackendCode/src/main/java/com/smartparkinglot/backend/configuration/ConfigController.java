package com.smartparkinglot.backend.configuration;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class ConfigController {

    @Autowired
    private Dotenv dotenv;

    @GetMapping("/config")
    public Map<String, String> getConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("baseUrl", dotenv.get("SERVER_URL"));
        config.put("stripePublicKey", dotenv.get("STRIPE_API_KEY_FRONTEND"));
        return config;
    }
}