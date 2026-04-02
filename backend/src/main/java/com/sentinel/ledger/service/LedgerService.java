package com.sentinel.ledger.service;

import com.sentinel.ledger.entity.Account;
import com.sentinel.ledger.entity.JournalEntry;
import com.sentinel.ledger.repository.AccountRepository;
import com.sentinel.ledger.repository.JournalEntryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LedgerService {
    private final AccountRepository accountRepository;
    private final JournalEntryRepository journalEntryRepository;

    @Transactional
    public void transferMoney(UUID fromId, UUID toId, BigDecimal amount, String reference){
//        fetch accounts
        Account fromAccount = accountRepository
                .findById(fromId)
                .orElseThrow(() -> new RuntimeException("Sender account not found"));

        Account toAccount = accountRepository
                .findById(toId)
                .orElseThrow(() -> new RuntimeException("Destination account not found"));

//        Business Logic: Check for sufficient funds
        if(fromAccount.getBalance().compareTo(amount)<0){
            throw new RuntimeException("Insufficient balance in account: " +fromAccount);
        }

//        Update balances
        fromAccount.setBalance(fromAccount.getBalance().subtract(amount));
        toAccount.setBalance(toAccount.getBalance().add(amount));

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

//        Create double entry journal records
        createJournalEntry(fromAccount, amount.negate(), "Transfer to "+toAccount.getName(), reference);
        createJournalEntry(fromAccount, amount.negate(), "Tranfer from "+fromAccount.getName(), reference);
    }

    private void createJournalEntry(Account account, BigDecimal amount, String desc, String ref){
        JournalEntry entry = new JournalEntry();
        entry.setAccount(account);
        entry.setAmount(amount);
        entry.setDescription(desc);
        entry.setTransactionReference(ref);
        journalEntryRepository.save(entry);
    }

    public List<Account> findAllAccounts(){
        return accountRepository.findAll();
    }
}
