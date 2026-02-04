package com.app.authservice.repository;

import com.app.authservice.entity.EmailVerificationToken;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.Optional;

public interface EmailVerificationTokenRepository
        extends JpaRepository<EmailVerificationToken, Long> {

    Optional<EmailVerificationToken> findByEmailAndCode(String email, String code);

    @Modifying
    @Transactional
    void deleteByEmail(String email);
}
