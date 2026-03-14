package com.example.smartinterviewportal.controller;

import com.example.smartinterviewportal.dto.RoleSelectionRequest;
import com.example.smartinterviewportal.model.User;
import com.example.smartinterviewportal.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/role")
@CrossOrigin(origins = "*")
public class RoleController {

    private final UserRepository userRepository;

    public RoleController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/select")
    public ResponseEntity<?> selectRole(@RequestBody RoleSelectionRequest request) {

        User user = userRepository.findById(request.getUserId()).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        user.setTargetRole(request.getTargetRole());

        userRepository.save(user);

        return ResponseEntity.ok("Role selected successfully");
    }
}