package com.sentinel.ledger.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.UUID;

public record TransferRequest(
        @NotNull(message = "Sender Id cannot be null")
        UUID fromId,

        @NotNull(message = "Receiver Id cannot be null")
        UUID toId,

        @NotNull(message = "Amount is required")
        @Positive(message = "Amount cannot be negative")
        BigDecimal amount,

        String reference
) {
}
