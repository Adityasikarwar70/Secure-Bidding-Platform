package com.app.authservice.service;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;

    public MailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendMail(String to, String subject, String body) {
      try {
      MimeMessage message = mailSender.createMimeMessage();

         MimeMessageHelper helper =
                 new MimeMessageHelper(message, true, "UTF-8");
         helper.setTo(to);
         helper.setSubject(subject);
         helper.setText(body, true);
         helper.setFrom("cdac0051@gmail.com");

        mailSender.send(message);
      }catch (Exception e) {
             throw new RuntimeException("Failed to send email", e);
         }
    }
}
