package com.app.authservice.dto;

import java.util.Set;

public class UserResponse {
    public Long id;
    public String username;
    public String email;
    public boolean isVerified;
    public Set<String> roles;
}
