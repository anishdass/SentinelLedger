package com.sentinel.ledger.controller;

import com.sentinel.ledger.dto.TransferRequest;
import com.sentinel.ledger.entity.Account;
import com.sentinel.ledger.service.LedgerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ledger")
@RequiredArgsConstructor
public class LedgerController {
    private final LedgerService ledgerService;

    @PostMapping("/transfer")
    public ResponseEntity<String> performTransfer(@Valid @RequestBody TransferRequest request){

        ledgerService.transferMoney(
                request.fromId(),
                request.toId(),
                request.amount(),
                request.reference()
        );
        return ResponseEntity.ok("Transfer Successful");
    }

    @GetMapping("/accounts")
    public ResponseEntity<List<Account>> getAllAccounts(){
        return ResponseEntity.ok(ledgerService.findAllAccounts());
    }
}
