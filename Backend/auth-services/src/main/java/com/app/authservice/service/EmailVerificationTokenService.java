package com.app.authservice.service;

import com.app.authservice.entity.TokenType;

public interface EmailVerificationTokenService {

    void generateAndSendToken(String email, TokenType type);

    boolean verifyCode(String email, String code, TokenType type);
}
