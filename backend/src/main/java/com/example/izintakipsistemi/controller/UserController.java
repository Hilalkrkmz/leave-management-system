package com.example.izintakipsistemi.controller;

import com.example.izintakipsistemi.dto.request.ChangePasswordRequest;
import com.example.izintakipsistemi.dto.request.UpdateLeaveBalanceRequest;
import com.example.izintakipsistemi.dto.response.UserResponse;
import com.example.izintakipsistemi.entity.User;
import com.example.izintakipsistemi.security.CustomUserDetails;
import com.example.izintakipsistemi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUser();
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/{id}/deactivate")
    public UserResponse deactivateUser(@PathVariable Long id) {
        return userService.deactivateUser(id);
    }

    @PutMapping("/{id}/leave-balance")
    public UserResponse updateLeaveBalance(@PathVariable Long id, @RequestBody UpdateLeaveBalanceRequest request) {
        return userService.updateLeaveBalance(id, request.getAnnualLeaveBalance());
    }

    @PutMapping("/change-password")
    public String changePassword(@RequestBody ChangePasswordRequest request) {
        User currentUser = getCurrentUser();
        userService.changePassword(currentUser.getId(), request.getCurrentPassword(), request.getNewPassword());
        return "Şifreniz başarıyla güncellendi.";
    }

    @GetMapping("/me")
    public UserResponse getCurrentUserInfo() {
        User currentUser = getCurrentUser();
        return userService.getUserById(currentUser.getId());
    }
}