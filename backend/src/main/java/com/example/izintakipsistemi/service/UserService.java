package com.example.izintakipsistemi.service;

import com.example.izintakipsistemi.dto.request.RegisterRequest;
import com.example.izintakipsistemi.dto.response.UserResponse;
import com.example.izintakipsistemi.entity.Role;
import com.example.izintakipsistemi.entity.User;
import com.example.izintakipsistemi.repository.UserRepository;
import com.example.izintakipsistemi.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public UserResponse createUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Bu email adresi zaten kayıtlı: " + request.getEmail());
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.valueOf(request.getRole()));
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        return toResponse(savedUser);
    }

    public UserResponse deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: " + id));

        user.setActive(false);
        User savedUser = userRepository.save(user);
        return toResponse(savedUser);
    }

    public UserResponse updateLeaveBalance(Long id, int newBalance) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: " + id));

        if (newBalance < 0) {
            throw new IllegalArgumentException("İzin bakiyesi negatif olamaz.");
        }

        user.setAnnualLeaveBalance(newBalance);
        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    // Entity'yi DTO'ya çeviren yardımcı metod
    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole().name(),
                user.isActive(),
                user.getAnnualLeaveBalance(),
                user.getCreatedAt()
        );
    }

    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: " + userId));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Mevcut şifre yanlış.");
        }

        if (newPassword == null || newPassword.isBlank()) {
            throw new IllegalArgumentException("Yeni şifre boş olamaz.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: " + id));
        return toResponse(user);
    }
}