package com.smartparkinglot.backend.service;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class GeocodingService {

    private static final String API_KEY = "AIzaSyCQnveA3osqanDT7SHtzkVYXyOypc__sKk";

    public String getAddress(BigDecimal latitude, BigDecimal longitude) {
        HttpClient client = HttpClient.newHttpClient();
        String latLong = latitude.toString() + "," + longitude.toString();
        String encodedLatLong = URLEncoder.encode(latLong, StandardCharsets.UTF_8);
        String requestUrl = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + encodedLatLong + "&key=" + API_KEY;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(requestUrl))
                .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return parseAddress(response.body());  // You need to implement parseAddress to extract the address
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return "Unable to retrieve address";
        }
    }

    private String parseAddress(String jsonResponse) {
        System.out.println(jsonResponse);

        JsonParser parser = new JsonParser();
        JsonObject jsonObject = parser.parse(jsonResponse).getAsJsonObject();

        // Check if the 'results' array is present and not empty
        if (jsonObject.has("results") && jsonObject.get("results").getAsJsonArray().size() > 0) {
            String address = jsonObject.get("results").getAsJsonArray().get(0).getAsJsonObject().get("formatted_address").getAsString();
            return address;
        } else {
            // Handle the case where no results are found
            return "No address found for the given coordinates";
        }
    }

}
