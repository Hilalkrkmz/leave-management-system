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
        requestData.setLeaveType(leaveType);//bu izin->yıllık i<in demek
        requestData.setStatus(LeaveStatus.PENDING);
        requestData.calculateTotalDays();

        return leaveRequestRepository.save(requestData);
    }
    //approved
    public LeaveRequest approveLeaveRequest(Long requestId,Long adminId){

        LeaveRequest request = leaveRequestRepository.findById(requestId)
                .orElseThrow(()-> new ResourceNotFoundException("Talep bulunamadı: "));

        if(request.getStatus() != LeaveStatus.PENDING){
            throw new IllegalStateException(
                    "Sadece pending durumundaki talepler onaylanabilir. Mevcut durum: "+ request.getStatus());
        }
            User admin = userRepository.findById(adminId)
                    .orElseThrow(()-> new ResourceNotFoundException("Admin bulunamadı: "+adminId));

            request.setStatus(LeaveStatus.APPROVED);
            request.setReviewedBy(admin);
            request.setReviewedAt(LocalDateTime.now());

            return leaveRequestRepository.save(request);
    }
    //rejected
    public LeaveRequest rejectLeaveRequest(Long requestId, Long adminId,String rejectionReason){

        if(rejectionReason== null || rejectionReason.isBlank()){
            throw new IllegalArgumentException("Red sebebi boş bırakılamaz");
        }

        LeaveRequest request = leaveRequestRepository.findById(requestId)
                .orElseThrow(()-> new ResourceNotFoundException("Talep bulunamadı: "));

        if(request.getStatus() != LeaveStatus.PENDING){
            throw new IllegalStateException(
                    "Sadece pending durumundaki talepler onaylanabilir. Mevcut durum: "+ request.getStatus());
        }
        User admin = userRepository.findById(adminId)
                .orElseThrow(()-> new ResourceNotFoundException("Admin bulunamadı: "+adminId));

        request.setStatus(LeaveStatus.REJECTED);
        request.setRejectionReason(rejectionReason);
        request.setReviewedBy(admin);
        request.setReviewedAt(LocalDateTime.now());

        return leaveRequestRepository.save(request);
    }
    //kendi taleplerini listeleme
    public List<LeaveRequest> getMyLeaveRequest(Long userId){
        return leaveRequestRepository.findByUserId(userId);
    }
    //bekleyen istekleri listeleme
    public List<LeaveRequest> getPendingRequest(){
        return leaveRequestRepository.findByStatus(LeaveStatus.PENDING);
    }
    //tüm talepleri listeleme
    public List<LeaveRequest> getAllRequest(){
        return leaveRequestRepository.findAll();
    }
}
