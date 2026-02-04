package com.app.authservice.service;

import com.app.authservice.dto.BecomeSellerRequest;
import com.app.authservice.entity.User;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;

public interface UserService {

    User saveUser(User user);

    User updateUser(Long userId, User user);

    Optional<User> getUserById(Long userId);

    Optional<User> getUserByUsername(String username);

    List<User> getAllUsers();

    void deleteUser(Long userId);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
    Optional<User> getUserByEmail(String email);
    User saveUpdatedUser(User user);
    List<User> getUnverifiedUsers();
    User verifyUser(Long id);
    ResponseEntity<?> becomeSeller(String username, BecomeSellerRequest request);


}
