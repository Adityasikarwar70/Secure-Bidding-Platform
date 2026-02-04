package com.app.authservice.dto;

import com.app.authservice.entity.TokenType;

public class VerifyEmailRequest {
    public String email;
    public TokenType type;
}
