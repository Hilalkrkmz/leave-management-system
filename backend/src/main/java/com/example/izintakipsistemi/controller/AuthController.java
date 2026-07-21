package com.example.izintakipsistemi.controller;

import com.example.izintakipsistemi.dto.request.LoginRequest;
import com.example.izintakipsistemi.dto.request.RegisterRequest;
import com.example.izintakipsistemi.dto.response.LoginResponse;
import com.example.izintakipsistemi.dto.response.UserResponse;
import com.example.izintakipsistemi.entity.User;
import com.example.izintakipsistemi.repository.UserRepository;
import com.example.izintakipsistemi.security.JwtService;
import com.example.izintakipsistemi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        String token = jwtService.generateToken(user.getEmail());
        return new LoginResponse(token, user.getEmail(), user.getRole().name());
    }

    @PostMapping("/register")
    public UserResponse register(@RequestBody RegisterRequest request) {
        return userService.createUser(request);
    }
}