package com.sentinel.ledger.repository;

import com.sentinel.ledger.entity.JournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface JournalEntryRepository extends JpaRepository<JournalEntry, UUID> {

    List<JournalEntry> findByAccountIdOrderByCreatedAtDesc(UUID accountId);
}
