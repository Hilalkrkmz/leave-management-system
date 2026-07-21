package com.example.izintakipsistemi.dto.request;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateLeaveRequest {
    private Long leaveTypeId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
}
