package com.example.izintakipsistemi.service;
import com.example.izintakipsistemi.entity.LeaveType;
import com.example.izintakipsistemi.repository.LeaveTypeRepository;
import com.example.izintakipsistemi.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveTypeService {
    private final LeaveTypeRepository leaveTypeRepository;

    public List<LeaveType> getAllActiveLeaveTypes() {
        return leaveTypeRepository.findByIsActiveTrue();
    }

    public LeaveType createLeaveType(LeaveType leaveType) {
        return leaveTypeRepository.save(leaveType);
    }

    public LeaveType deactivateLeaveType(Long id) {
        LeaveType leaveType = leaveTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("İzin türü bulunamadı: " + id));

        leaveType.setActive(false);
        return leaveTypeRepository.save(leaveType);
    }

}
