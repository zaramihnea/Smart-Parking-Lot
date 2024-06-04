package com.smartparkinglot.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class PlacesAPIProxyController {

    private static final String API_KEY = "AIzaSyC0c45KPuqZ2kVQcNWU89SLAj0m7DhKQ-A";
    private static final String GOOGLE_API_URL = "https://maps.googleapis.com/maps/api/place/autocomplete/json";

    @GetMapping("/autocomplete")
    public ResponseEntity<String> getAutocomplete(@RequestParam String input) {
        String url = String.format("%s?input=%s&location=47.1585,27.6014&radius=10000&key=%s",
                GOOGLE_API_URL,
                input,
                API_KEY);

        RestTemplate restTemplate = new RestTemplate();
        try {
            String response = restTemplate.getForObject(url, String.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"Internal server error\"}");
        }
    }
}