package com.app.authservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.app.authservice.dto.ApiResponse;
import com.app.authservice.dto.BecomeSellerRequest;
import com.app.authservice.dto.RegisterRequest;
import com.app.authservice.dto.UserResponse;
import com.app.authservice.entity.User;
import com.app.authservice.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    // Get user by id
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','BUYER')")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404)
                        .body(new ApiResponse(false, "User not found")));
    }

    // Update user
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','BUYER')")
    public UserResponse updateUser(
            @PathVariable Long id,
            @RequestBody RegisterRequest request
    ) {
        User user = new User();
        user.setFirstName(request.firstName);
        user.setLastName(request.lastName);
        user.setEmail(request.email);
        user.setMobileNo(request.mobileNo);
        user.setAddress(request.address);

        User updated = userService.updateUser(id, user);

        UserResponse response = new UserResponse();
        response.id = updated.getId();
        response.username = updated.getUsername();
        response.email = updated.getEmail();

        return response;
    }

    // Delete users
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "User deleted successfully";
    }

    // Get All users
    @GetMapping("/allUser")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get unverified users
    @GetMapping("/unverified")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getUnverifiedUsers() {
        return userService.getUnverifiedUsers();
    }

    // Verify users
    @PutMapping("/verify/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> verifyUser(@PathVariable Long id) {
        userService.verifyUser(id);
        return ResponseEntity.ok(new ApiResponse(true, "User verified successfully"));
    }

    // Become seller
    @PostMapping("/become-seller")
    @PreAuthorize("hasAnyRole('BUYER','ADMIN')")
    public ResponseEntity<?> becomeSeller(@RequestBody BecomeSellerRequest request) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(new ApiResponse(false, "Not authenticated"));
        }

        String username = auth.getName();

        System.out.println("USERNAME FROM TOKEN = " + username);

        return userService.becomeSeller(username, request);
    }
}
