package com.app.authservice.service;

public interface MailService {
    void sendMail(String to, String subject, String body);
}
