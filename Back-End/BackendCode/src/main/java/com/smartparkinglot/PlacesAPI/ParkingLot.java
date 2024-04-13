package com.smartparkinglot.PlacesAPI;

import com.google.maps.GeoApiContext;
import com.google.maps.PlacesApi;
import com.google.maps.model.PlaceDetails;
import com.google.maps.model.PlacesSearchResponse;
import com.google.maps.model.PlacesSearchResult;
import com.google.maps.errors.ApiException;
import com.google.maps.GeocodingApi;
import com.google.maps.model.GeocodingResult;

import java.io.IOException;
import java.util.Scanner;

public class ParkingLot {

    private final String apiKey;
    private String name;
    private String address;
    private String placeId;
    private float rating;
    // Sunt mult mai multe propritati care probabil pot fi incluse pentru filtrarea rezultatelor la cererea utilizatorului

    public ParkingLot(String apiKey){
        this.apiKey = apiKey;
    }

    public void findClosestLotInfo() {
        GeoApiContext context = new GeoApiContext.Builder().apiKey(apiKey).build();
        Scanner scanner = new Scanner(System.in);
        System.out.println("\nEnter an address:");
        String cityName = scanner.nextLine();
        try {
            GeocodingResult[] results = GeocodingApi.geocode(context, cityName).await();
            if (results != null && results.length > 0) {
                System.out.println("Latitudine: " + results[0].geometry.location.lat);
                System.out.println("Longitudine: " + results[0].geometry.location.lng);
            } else {
                System.out.println("[ERROR] Address not found");
                return;
            }
            PlacesSearchResponse response = PlacesApi
                    .textSearchQuery(context, "parking") // Cautare dupa cuv. cheie
                    .location(results[0].geometry.location) // Locatia aleasa
                    .radius(1000) // Distanta maxima in metri
                    .await();

            PlacesSearchResult closestParkingLot = findClosestParkingLot(response.results, results[0].geometry.location.lat, results[0].geometry.location.lng);
            PlaceDetails details = PlacesApi.placeDetails(context, closestParkingLot.placeId).await();

            this.name = details.name;
            this.address = details.formattedAddress;
            this.rating = details.rating;
            this.placeId = details.placeId;
            //System.out.println(response.results.length); // 20 rezultate maxim for efficiency reasons (PlacesAPI)
        } catch (ApiException | InterruptedException | IOException | NullPointerException e) {
            e.printStackTrace();
        }
    }

    public PlacesSearchResult findClosestParkingLot(PlacesSearchResult[] results, double currentPosLat, double currentPosLong){
        PlacesSearchResult closestParkingLot = null;
        double R = 6371;
        double distance = Double.MAX_VALUE;
        for (PlacesSearchResult result : results) {
            // Formula ce calculeaza distanta intre doua pozitii in km (Haversine formula)
            double dLat = Math.toRadians(result.geometry.location.lat - currentPosLat);
            double dLon = Math.toRadians(result.geometry.location.lng - currentPosLong);
            double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(Math.toRadians(currentPosLong)) * Math.cos(Math.toRadians(result.geometry.location.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            double distanceInKm = R * c;
            if (distanceInKm < distance){
                distance = distanceInKm;
                closestParkingLot = result;
            }
        }
        return closestParkingLot;
    }

    @Override
    public String toString() {
        return this.placeId == null ? "The Parking Lot hasn't been found yet :(" : "ParkingLot{" +
                "\n\tplaceId='" + placeId + '\'' +
                "\n\tname='" + name + '\'' +
                "\n\taddress='" + address + '\'' +
                "\n\trating=" + rating +
                "\n}";
    }
}
