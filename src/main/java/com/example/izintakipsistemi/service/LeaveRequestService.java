package com.example.izintakipsistemi.service;
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

    public LeaveRequest createLeaveRequest(Long userId, Long leaveTypeId, LeaveRequest requestData) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: " + userId));

        LeaveType leaveType = leaveTypeRepository.findById(leaveTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("İzin türü bulunamadı: " + leaveTypeId));

        if (requestData.getEndDate().isBefore(requestData.getStartDate())) {
            throw new IllegalArgumentException("Bitiş tarihi, başlangıç tarihinden önce olamaz.");
        }

        requestData.setUser(user);
        requestData.setLeaveType(leaveType);
        requestData.setStatus(LeaveStatus.PENDING);
        requestData.calculateTotalDays();

        return leaveRequestRepository.save(requestData);
    }
}
