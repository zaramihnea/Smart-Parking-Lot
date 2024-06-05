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
    @JoinColumn(name = "admin_email", referencedColumnName = "email", foreignKey = @ForeignKey(name = "fk_messages_admin_users"))
    private User admin;

    @Column(name = "message_content", length = 256)
    private String messageContent;

    @Column(name = "date_added")
    private Date dateAdded;

    @Column(name = "seen")
    private Boolean seen;

    public Message() {
    }

    public Message(User admin, String messageContent, Date dateAdded, Boolean seen) {
        this.admin = admin;
        this.messageContent = messageContent;
        this.dateAdded = dateAdded;
        this.seen = seen;
    }

    // Getters and setters

    public Long getMessageId() {
        return messageId;
    }

    public void setMessageId(Long messageId) {
        this.messageId = messageId;
    }

    public User getAdmin() {
        return admin;
    }

    public void setAdmin(User admin) {
        this.admin = admin;
    }

    public String getMessageContent() {
        return messageContent;
    }

    public void setMessageContent(String messageContent) {
        this.messageContent = messageContent;
    }

    public Date getDateAdded() {
        return dateAdded;
    }

    public void setDateAdded(Date dateAdded) {
        this.dateAdded = dateAdded;
    }

    public Boolean getSeen() {
        return seen;
    }

    public void setSeen(Boolean seen) {
        this.seen = seen;
    }
}
