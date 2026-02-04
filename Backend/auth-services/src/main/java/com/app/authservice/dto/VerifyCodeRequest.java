package com.app.authservice.dto;

import com.app.authservice.entity.TokenType;

public class VerifyCodeRequest {
    public String email;
    public String code;
    public TokenType type;
}
