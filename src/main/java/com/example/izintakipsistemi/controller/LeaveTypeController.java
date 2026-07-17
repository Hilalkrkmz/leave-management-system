package com.example.izintakipsistemi.controller;
import com.example.izintakipsistemi.entity.LeaveType;
import com.example.izintakipsistemi.service.LeaveTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-types")
@RequiredArgsConstructor
public class LeaveTypeController {

    private final LeaveTypeService leaveTypeService;

    @GetMapping
    public List<LeaveType> getAllLeaveType(){
        return leaveTypeService.getAllActiveLeaveTypes();
    }

    @PostMapping
    public LeaveType createLeaveType(@RequestBody LeaveType leaveType){
        return leaveTypeService.createLeaveType(leaveType);
    }

    @PutMapping("/{id}/deactivate")
    public LeaveType deactivateLeaveType(@PathVariable Long id){
        return leaveTypeService.deactivateLeaveType(id);
    }
}
