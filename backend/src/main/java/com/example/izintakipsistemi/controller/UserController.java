package com.example.izintakipsistemi.controller;

import com.example.izintakipsistemi.dto.request.UpdateLeaveBalanceRequest;
import com.example.izintakipsistemi.dto.response.UserResponse;
import com.example.izintakipsistemi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

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
}