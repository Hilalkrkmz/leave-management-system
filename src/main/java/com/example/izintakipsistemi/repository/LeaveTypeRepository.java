package com.example.izintakipsistemi.repository;
import com.example.izintakipsistemi.entity.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeaveTypeRepository extends JpaRepository<LeaveType, Long> {

    List<LeaveType> findByIsActiveTrue();
}