package com.smartparkinglot.PlacesAPI;

public class Main {
    public static void main(String[] args) {
        // Exemplu practic de utilizarea PlacesAPI (si un pic de GeocodingAPI) in contextul proiectului
        ParkingLot closestParkingLotToYou = new ParkingLot("apiKey");
        while (true) {
            closestParkingLotToYou.findClosestLotInfo();
            System.out.println(closestParkingLotToYou);
        }
    }
}