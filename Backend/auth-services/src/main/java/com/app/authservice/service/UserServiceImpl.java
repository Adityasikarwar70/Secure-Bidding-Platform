package com.app.authservice.service;

import com.app.authservice.dto.BecomeSellerRequest;
import com.app.authservice.dto.ApiResponse;
import com.app.authservice.entity.Role;
import com.app.authservice.entity.RoleName;
import com.app.authservice.entity.User;
import com.app.authservice.repository.RoleRepository;
import com.app.authservice.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Find by email
    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Save Updated user
    @Override
    public User saveUpdatedUser(User user) {
        return userRepository.save(user);
    }

    // Save user
    @Override
    public User saveUser(User user) {

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Update user
    @Override
    public User updateUser(Long userId, User updatedUser) {
        return userRepository.findById(userId)
                .map(existingUser -> {
                    existingUser.setFirstName(updatedUser.getFirstName());
                    existingUser.setLastName(updatedUser.getLastName());
                    existingUser.setEmail(updatedUser.getEmail());
                    existingUser.setMobileNo(updatedUser.getMobileNo());
                    existingUser.setAddress(updatedUser.getAddress());
                    return userRepository.save(existingUser);
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Find by id
    @Override
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    // Find by username
    @Override
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Get all user
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Delete user
    @Override
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    // Check exists by username
    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // Get verified users
    @Override
    public List<User> getUnverifiedUsers() {
        return userRepository.findByIsVerifiedFalse();
    }

    // Verify users
    @Override
    public User verifyUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setVerified(true);
        return userRepository.save(user);
    }

    // Become seller
    @Override
    public ResponseEntity<?> becomeSeller(String username, BecomeSellerRequest request) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Check if already seller
        boolean alreadySeller = user.getRoles()
                .stream()
                .anyMatch(r -> r.getName() == RoleName.SELLER);

        if (alreadySeller) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "User is already a SELLER"));
        }

        // 2. Check if verified
        if (!user.isVerified()) {
            return ResponseEntity.status(403)
                    .body(new ApiResponse(false, "User is not verified by admin"));
        }

        // 3. Check Aadhaar
        if (!user.getAadharCardNumber().equals(request.aadharNumber)) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Aadhaar number does not match"));
        }

        // 4. Check PAN
        if (!user.getPanCardNumber().equals(request.panNumber)) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "PAN number does not match"));
        }

        // 5. Add SELLER role
        Role sellerRole = roleRepository.findByName(RoleName.SELLER)
                .orElseThrow(() -> new RuntimeException("SELLER role not found"));

        user.getRoles().add(sellerRole);
        userRepository.save(user);

        return ResponseEntity.ok(new ApiResponse(true, "User is now a SELLER"));
    }
}
