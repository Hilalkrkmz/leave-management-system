package com.example.izintakipsistemi.controller;

import com.example.izintakipsistemi.dto.request.CreateLeaveRequest;
import com.example.izintakipsistemi.dto.request.RejectLeaveRequest;
import com.example.izintakipsistemi.dto.response.LeaveRequestResponse;
import com.example.izintakipsistemi.entity.User;
import com.example.izintakipsistemi.security.CustomUserDetails;
import com.example.izintakipsistemi.service.LeaveRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
@RequiredArgsConstructor
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUser();
    }

    @PostMapping
    public LeaveRequestResponse createLeaveRequest(@RequestBody CreateLeaveRequest request) {
        User currentUser = getCurrentUser();
        return leaveRequestService.createLeaveRequest(currentUser.getId(), request);
    }

    @GetMapping("/my")
    public List<LeaveRequestResponse> getMyLeaveRequests() {
        User currentUser = getCurrentUser();
        return leaveRequestService.getMyLeaveRequests(currentUser.getId());
    }

    @GetMapping("/pending")
    public List<LeaveRequestResponse> getPendingRequests() {
        return leaveRequestService.getPendingRequests();
    }

    @GetMapping
    public List<LeaveRequestResponse> getAllRequests() {
        return leaveRequestService.getAllRequests();
    }

    @PutMapping("/{id}/approve")
    public LeaveRequestResponse approveLeaveRequest(@PathVariable Long id) {
        User currentAdmin = getCurrentUser();
        return leaveRequestService.approveLeaveRequest(id, currentAdmin.getId());
    }

    @PutMapping("/{id}/reject")
    public LeaveRequestResponse rejectLeaveRequest(@PathVariable Long id, @RequestBody RejectLeaveRequest request) {
        User currentAdmin = getCurrentUser();
        return leaveRequestService.rejectLeaveRequest(id, currentAdmin.getId(), request.getRejectionReason());
    }
}