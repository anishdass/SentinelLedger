package com.sentinel.ledger.config;

import ch.qos.logback.core.net.SyslogOutputStream;
import com.sentinel.ledger.entity.Account;
import com.sentinel.ledger.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AccountRepository accountRepository;

    @Override
    public void run(String... args) throws Exception {
        if(accountRepository.count() == 0){
//            Create bank reserve
            Account bankReserve = new Account("BANK_RESERVE_001", new BigDecimal("100000.00"));

//            Create user account
            Account userWallet = new Account("USER_WALLET_ALICE", new BigDecimal("500.00"));

//            Save it to the repository
            accountRepository.save(bankReserve);
            accountRepository.save(userWallet);

//            Print
            System.out.println("----------------------------------------------------------");
            System.out.println("DEMO DATA INITIALIZED");
            System.out.println("Bank account id: "+bankReserve.getId());
            System.out.println("User account id: "+userWallet.getId());
            System.out.println("----------------------------------------------------------");
        }
    }
}
