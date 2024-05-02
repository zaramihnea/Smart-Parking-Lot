package com.smartparkinglot.backend.customexceptions;

public class UsernameExistsException extends Exception{
    public UsernameExistsException(String message) {
        super(message);
    }
}
