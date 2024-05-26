package com.smartparkinglot.backend.DTO;

import lombok.Getter;

@Getter
public class RefundRequest {
    private TransactionDTO transactionDTO;
    private String email;
}