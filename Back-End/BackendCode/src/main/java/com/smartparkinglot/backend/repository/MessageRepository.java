package com.smartparkinglot.backend.repository;

import com.smartparkinglot.backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findAllByAdminEmail(String adminEmail);
    Message findById(long id);

    void deleteByMessageId(Long messageId);
}
