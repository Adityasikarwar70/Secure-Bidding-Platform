package com.app.authservice.controller;

import com.app.authservice.dto.*;
import com.app.authservice.entity.RoleName;
import com.app.authservice.entity.TokenType;
import com.app.authservice.entity.User;
import com.app.authservice.security.JwtUtil;
import com.app.authservice.service.EmailVerificationTokenService;
import com.app.authservice.service.RoleService;
import com.app.authservice.service.UserService;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailVerificationTokenService emailVerificationTokenService;

    public AuthController(
            UserService userService,
            RoleService roleService,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            EmailVerificationTokenService emailVerificationTokenService
    ) {
        this.userService = userService;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailVerificationTokenService = emailVerificationTokenService;
    }

    // Register
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request) {

        var roleOpt = roleService.getRoleByName(RoleName.BUYER);
        if (roleOpt.isEmpty()) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse(false, "BUYER role not found"));
        }

        User user = new User();
        user.setFirstName(request.firstName);
        user.setLastName(request.lastName);
        user.setUsername(request.username);
        user.setEmail(request.email);
        user.setPassword(request.password);
        user.setVerified(false);
        user.setMobileNo(request.mobileNo);
        user.setAddress(request.address);
        user.setPanCardUrl(request.panCardUrl);
        user.setAadharCardUrl(request.aadharCardUrl);
        user.setLivePhotoUrl(request.livePhotoUrl);
        user.setAadharCardNumber(request.aadharNo);
        user.setPanCardNumber(request.pancardNo);
        user.setRoles(Set.of(roleOpt.get()));

        userService.saveUser(user);

        return ResponseEntity.ok(new ApiResponse(true, "User registered successfully"));
    }


    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse res) {

        var userOpt = userService.getUserByUsername(request.username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse(false, "Invalid credentials"));
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(request.password, user.getPassword())) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse(false, "Invalid credentials"));
        }

        Set<String> roles = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toSet());

        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getUsername(), roles);
        String refreshToken = jwtUtil.generateRefreshToken(user.getId(), user.getUsername(), roles);

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true).secure(false).path("/").maxAge(7 * 24 * 60 * 60).sameSite("Lax").build();

        res.addHeader("Set-Cookie", refreshCookie.toString());

        UserResponse userResponse = new UserResponse();
        userResponse.id = user.getId();
        userResponse.username = user.getUsername();
        userResponse.email = user.getEmail();
        userResponse.roles = roles;
        userResponse.isVerified = user.isVerified();

        AuthResponse response = new AuthResponse();
        response.accessToken = accessToken;
        response.user = userResponse;

        return ResponseEntity.ok(response);
    }


    // Send E-Mail code
    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse> verifyEmail(@RequestBody VerifyEmailRequest request) {

        boolean exists = userService.existsByEmail(request.email);

        if (request.type == TokenType.RESET_PASSWORD && !exists) {
            return ResponseEntity.status(404)
                    .body(new ApiResponse(false, "User not found with this email"));
        }

        if (request.type == TokenType.VERIFY_EMAIL && exists) {
            return ResponseEntity.status(400)
                    .body(new ApiResponse(false, "Email already registered"));
        }

        emailVerificationTokenService.generateAndSendToken(request.email, request.type);

        return ResponseEntity.ok(new ApiResponse(true, "Verification code sent to email"));
    }



    // Verify code
    @PostMapping("/verify-code")
    public ResponseEntity<ApiResponse> verifyCode(@RequestBody VerifyCodeRequest request) {

        boolean ok = emailVerificationTokenService.verifyCode(
                request.email, request.code, request.type
        );

        if (!ok) {
            return ResponseEntity.status(400)
                    .body(new ApiResponse(false, "Invalid or expired code"));
        }

        return ResponseEntity.ok(new ApiResponse(true, "Code verified successfully"));
    }



    // Renew access token
    @PostMapping("/renew-access-token")
    public ResponseEntity<?> renewAccessToken(
            @CookieValue(name = "refreshToken", required = false) String refreshToken
    ) {
        if (refreshToken == null) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse(false, "Refresh token missing"));
        }

        try {
            var claims = jwtUtil.extractClaims(refreshToken);

            Long userId = claims.get("userId", Long.class);
            String username = claims.get("username", String.class);
            List<?> rolesList = claims.get("roles", List.class);
            Set<String> roles = rolesList
                    .stream()
                    .map(Object::toString)
                    .collect(Collectors.toSet());
            String newAccessToken = jwtUtil.generateAccessToken(userId, username, roles);

            AuthResponse response = new AuthResponse();
            response.accessToken = newAccessToken;

            UserResponse user = new UserResponse();
            user.id = userId;
            user.username = username;
            user.roles = roles;

            response.user = user;

            return ResponseEntity.ok(response);

        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse(false, "Refresh token expired"));
        }
    }


    // Reset password
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(@RequestBody ResetPasswordRequest request) {

        var userOpt = userService.getUserByEmail(request.email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(new ApiResponse(false, "User not found"));
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(request.newPassword));
        userService.saveUpdatedUser(user);

        return ResponseEntity.ok(new ApiResponse(true, "Password updated successfully"));
    }

}
