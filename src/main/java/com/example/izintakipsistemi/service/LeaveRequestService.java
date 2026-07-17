package com.example.izintakipsistemi.service;

import com.example.izintakipsistemi.dto.request.CreateLeaveRequest;
import com.example.izintakipsistemi.dto.response.LeaveRequestResponse;
import com.example.izintakipsistemi.entity.*;
import com.example.izintakipsistemi.repository.LeaveRequestRepository;
import com.example.izintakipsistemi.repository.UserRepository;
import com.example.izintakipsistemi.repository.LeaveTypeRepository;
import com.example.izintakipsistemi.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;
    private final LeaveTypeRepository leaveTypeRepository;

    public LeaveRequestResponse createLeaveRequest(Long userId, CreateLeaveRequest dto) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: " + userId));

        LeaveType leaveType = leaveTypeRepository.findById(dto.getLeaveTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("İzin türü bulunamadı: " + dto.getLeaveTypeId()));

        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new IllegalArgumentException("Bitiş tarihi, başlangıç tarihinden önce olamaz.");
        }

        LeaveRequest request = new LeaveRequest();
        request.setUser(user);
        request.setLeaveType(leaveType);
        request.setStartDate(dto.getStartDate());
        request.setEndDate(dto.getEndDate());
        request.setReason(dto.getReason());
        request.setStatus(LeaveStatus.PENDING);
        request.calculateTotalDays();

        LeaveRequest saved = leaveRequestRepository.save(request);
        return toResponse(saved);
    }

    public LeaveRequestResponse approveLeaveRequest(Long requestId, Long adminId) {

        LeaveRequest request = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Talep bulunamadı: " + requestId));

        if (request.getStatus() != LeaveStatus.PENDING) {
            throw new IllegalStateException(
                    "Sadece bekleyen (PENDING) talepler onaylanabilir. Mevcut durum: " + request.getStatus());
        }

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin bulunamadı: " + adminId));

        request.setStatus(LeaveStatus.APPROVED);
        request.setReviewedBy(admin);
        request.setReviewedAt(LocalDateTime.now());

        LeaveRequest saved = leaveRequestRepository.save(request);
        return toResponse(saved);
    }

    public LeaveRequestResponse rejectLeaveRequest(Long requestId, Long adminId, String rejectionReason) {

        if (rejectionReason == null || rejectionReason.isBlank()) {
            throw new IllegalArgumentException("Red sebebi boş bırakılamaz");
        }

        LeaveRequest request = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Talep bulunamadı: " + requestId));

        if (request.getStatus() != LeaveStatus.PENDING) {
            throw new IllegalStateException(
                    "Sadece pending durumundaki talepler reddedilebilir. Mevcut durum: " + request.getStatus());
        }

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin bulunamadı: " + adminId));

        request.setStatus(LeaveStatus.REJECTED);
        request.setRejectionReason(rejectionReason);
        request.setReviewedBy(admin);
        request.setReviewedAt(LocalDateTime.now());

        LeaveRequest saved = leaveRequestRepository.save(request);
        return toResponse(saved);
    }

    public List<LeaveRequestResponse> getMyLeaveRequests(Long userId) {
        return leaveRequestRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<LeaveRequestResponse> getPendingRequests() {
        return leaveRequestRepository.findByStatus(LeaveStatus.PENDING)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<LeaveRequestResponse> getAllRequests() {
        return leaveRequestRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private LeaveRequestResponse toResponse(LeaveRequest request) {
        return new LeaveRequestResponse(
                request.getId(),
                request.getUser().getFirstName() + " " + request.getUser().getLastName(),
                request.getLeaveType().getName(),
                request.getStartDate(),
                request.getEndDate(),
                request.getTotalDays(),
                request.getReason(),
                request.getStatus().name(),
                request.getRejectionReason(),
                request.getReviewedBy() != null
                        ? request.getReviewedBy().getFirstName() + " " + request.getReviewedBy().getLastName()
                        : null,
                request.getReviewedAt(),
                request.getCreatedAt()
        );
    }
}