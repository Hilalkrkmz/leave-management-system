package com.example.izintakipsistemi.repository;
import com.example.izintakipsistemi.entity.LeaveRequest;
import com.example.izintakipsistemi.entity.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    // Bir personelin kendi taleplerini görmesi için
    List<LeaveRequest> findByUserId(Long userId);

    // Admin'in bekleyen talepleri görmesi için
    List<LeaveRequest> findByStatus(LeaveStatus status);

    // Bir personelin, belirli statüdeki taleplerini görmesi için
    List<LeaveRequest> findByUserIdAndStatus(Long userId, LeaveStatus status);
}