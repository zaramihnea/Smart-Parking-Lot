package com.smartparkinglot.backend.customexceptions;

public class UserIsBannedException extends Exception{
    public UserIsBannedException(String message) {
        super(message);
    }
}
