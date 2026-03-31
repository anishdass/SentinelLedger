package com.sentinel.ledger.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "account")
@Getter
@Setter
@NoArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String currency="GBP";

    @Column(precision = 19, scale = 4, nullable = false)
    private BigDecimal balance= BigDecimal.ZERO;

    public Account(String name, BigDecimal initialBalance){
        this.name = name;
        this.balance = initialBalance;
    }
}
