package com.smartparkinglot.backend.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Long messageId;

    @ManyToOne
    @JoinColumn(name = "sender_email", referencedColumnName = "email", foreignKey = @ForeignKey(name = "fk_messages_sender_users"))
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_email", referencedColumnName = "email", foreignKey = @ForeignKey(name = "fk_messages_receiver_users"))
    private User receiver;

    @Column(name = "message_content", length = 256)
    private String messageContent;

    @Column(name = "timestamp")
    private Date timestamp;

    @Column(name = "status")
    private Boolean status;

    public Message() {
    }

    public Message(Long messageId, User sender, User receiver, String messageContent, Date timestamp) {
        this.messageId = messageId;
        this.sender = sender;
        this.receiver = receiver;
        this.messageContent = messageContent;
        this.timestamp = timestamp;
        this.status = false;
    }

    // Getters and setters


    public Long getMessageId() {
        return messageId;
    }

    public void setMessageId(Long messageId) {
        this.messageId = messageId;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public User getReceiver() {
        return receiver;
    }

    public void setReceiver(User receiver) {
        this.receiver = receiver;
    }

    public String getMessageContent() {
        return messageContent;
    }

    public void setMessageContent(String messageContent) {
        this.messageContent = messageContent;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }
}
