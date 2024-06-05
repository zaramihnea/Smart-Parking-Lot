package com.smartparkinglot.backend.service;

import com.smartparkinglot.backend.entity.Message;
import com.smartparkinglot.backend.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public void saveMessage(Message message) {
        messageRepository.save(message);
    }

    public List<Message> findAllByAdminEmail(String adminEmail) {
        return messageRepository.findAllByAdminEmail(adminEmail);
    }

    public Message findById(long id) {
        return messageRepository.findById(id);
    }

    public void deleteMessage(Message message) {
        messageRepository.deleteByMessageId(message.getMessageId());
    }
}
