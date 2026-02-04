package com.app.authservice.service;

import com.app.authservice.entity.EmailVerificationToken;

import com.app.authservice.entity.TokenType;
import com.app.authservice.repository.EmailVerificationTokenRepository;

import org.springframework.transaction.annotation.Transactional;


import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class EmailVerificationTokenServiceImpl implements EmailVerificationTokenService {

    private final EmailVerificationTokenRepository tokenRepository;
    private final MailService mailService;

    public EmailVerificationTokenServiceImpl(
            EmailVerificationTokenRepository tokenRepository,
            MailService mailService
    ) {
        this.tokenRepository = tokenRepository;
        this.mailService = mailService;
    }
    @Transactional
    @Override
    public void generateAndSendToken(String email, TokenType type) {

        // delete old tokens for same email
        tokenRepository.deleteByEmail(email);

        // Generate 6 digit code
        String code = String.valueOf(100000 + new Random().nextInt(900000));

        EmailVerificationToken token = new EmailVerificationToken();
        token.setEmail(email);
        token.setCode(code);
        token.setType(type);
        token.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        tokenRepository.save(token);

        // send mail
        String subject = "Your verification code";
        String body = "<!DOCTYPE html>\r\n"
        		+ "<html lang=\"en\">\r\n"
        		+ "<head>\r\n"
        		+ "  <meta charset=\"UTF-8\" />\r\n"
        		+ "  <title>OTP Verification</title>\r\n"
        		+ "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\r\n"
        		+ "  <link href=\"https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700&display=swap\" rel=\"stylesheet\">\r\n"
        		+ "</head>\r\n"
        		+ "\r\n"
        		+ "<body style=\"margin:0;padding:0;background-color:#f1f1f1;font-family:'Montserrat',sans-serif;\">\r\n"
        		+ "\r\n"
        		+ "  <div style=\"width:100%;padding:40px 0;background-color:#f1f1f1;\">\r\n"
        		+ "    <div style=\"\r\n"
        		+ "      max-width:520px;\r\n"
        		+ "      margin:0 auto;\r\n"
        		+ "      background:#ffffff;\r\n"
        		+ "      border-radius:10px;\r\n"
        		+ "      overflow:hidden;\r\n"
        		+ "      box-shadow:0 10px 30px rgba(0,0,0,0.08);\r\n"
        		+ "    \">\r\n"
        		+ "\r\n"
        		+ "      <!-- Header -->\r\n"
        		+ "      <div style=\"\r\n"
        		+ "        background:#1b4332;\r\n"
        		+ "        padding:20px;\r\n"
        		+ "        text-align:center;\r\n"
        		+ "      \">\r\n"
        					
        		+ "        <img\r\n"
        		+ "          src=\"https://res.cloudinary.com/dyqnk0vmv/image/upload/v1769210812/tg16xiuwmg0bqz0pqgmp.png\"\r\n"
        		+ "          alt=\"Logo\"\r\n"
        		+ "          style=\"\r\n"
        		+ "            background:#95d5b2;\r\n"
        		+ "            padding:8px 12px;\r\n"
        		+ "            border-radius:6px;\r\n"
        		+ "            width:50px;\r\n"
        		+ "            aspect-ratio:1;\r\n"
        		+ "          \"\r\n"
        		+ "        />\r\n"
        		+ "      </div>\r\n"
        		+ "\r\n"
        		+ "      <!-- Body -->\r\n"
        		+ "      <div style=\"padding:30px;text-align:center;\">\r\n"
        		+ "        <h2 style=\"\r\n"
        		+ "          margin:0;\r\n"
        		+ "          color:#1b4332;\r\n"
        		+ "          font-weight:600;\r\n"
        		+ "        \">\r\n"
        		+ "          Verify Your Email\r\n"
        		+ "        </h2>\r\n"
        		+ "\r\n"
        		+ "        <p style=\"\r\n"
        		+ "          margin:20px 0;\r\n"
        		+ "          color:#555;\r\n"
        		+ "          font-size:15px;\r\n"
        		+ "          line-height:1.6;\r\n"
        		+ "        \">\r\n"
        		+ "          Use the One-Time Password (OTP) below to complete your verification.\r\n"
        		+ "           <strong>This OTP is valid for 5 Min Only</strong>.\r\n"
        		+ "        </p>\r\n"
        		+ "\r\n"
        		+ "        <!-- OTP -->\r\n"
        		+ "        <div style=\"\r\n"
        		+ "          display:inline-block;\r\n"
        		+ "          padding:14px 28px;\r\n"
        		+ "          background:#d8f3dc;\r\n"
        		+ "          border-radius:8px;\r\n"
        		+ "          font-size:26px;\r\n"
        		+ "          font-weight:700;\r\n"
        		+ "          color:#1b4332;\r\n"
        		+ "          letter-spacing:4px;\r\n"
        		+ "        \">\r\n"
        		+ "          " + code + "\r\n"
        		+ "        </div>\r\n"
        		+ "        \r\n"
        		+ "\r\n"
        		+ "        <p style=\"\r\n"
        		+ "          margin-top:20px;\r\n"
        		+ "          font-size:13px;\r\n"
        		+ "          color:#888;\r\n"
        		+ "        \">\r\n"
        		+ "          Do not share this OTP with anyone.\r\n"
        		+ "        </p>\r\n"
        		+ "      </div>\r\n"
        		+ "\r\n"
        		+ "      <!-- Footer -->\r\n"
        		+ "      <div style=\"\r\n"
        		+ "        background:#f7f7f7;\r\n"
        		+ "        padding:15px;\r\n"
        		+ "        text-align:center;\r\n"
        		+ "        font-size:12px;\r\n"
        		+ "        color:#777;\r\n"
        		+ "      \">\r\n"
        		+ "        © 2026 BidX Platform<br />\r\n"
        		+ "        Secure • Transparent • Trusted\r\n"
        		+ "      </div>\r\n"
        		+ "\r\n"
        		+ "    </div>\r\n"
        		+ "  </div>\r\n"
        		+ "\r\n"
        		+ "</body>\r\n"
        		+ "</html>";
        mailService.sendMail(email, subject, body);
    }

    @Transactional
    @Override
    public boolean verifyCode(String email, String code, TokenType type) {

        EmailVerificationToken token = tokenRepository
                .findByEmailAndCode(email, code)
                .orElse(null);

        if (token == null) return false;

        if (token.getType() != type) return false;

        if (token.getExpiryTime().isBefore(LocalDateTime.now())) {
            return false;
        }

        //delete token from db after successful verification
        tokenRepository.delete(token);

        return true;
    }
}
