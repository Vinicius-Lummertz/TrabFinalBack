package com.spotifyclone.api.controller;

import com.spotifyclone.api.dto.UserRequestDTO;
import com.spotifyclone.api.dto.UserResponseDTO;
import com.spotifyclone.api.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.spotifyclone.api.dto.UserLoginDTO;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponseDTO create(@RequestBody @Valid UserRequestDTO dto) {
        return userService.create(dto);
    }

    @GetMapping("/{id}")
    public UserResponseDTO findById(@PathVariable Long id) {
        return userService.findById(id);
    }


    @PostMapping("/login")
    public UserResponseDTO login(@RequestBody @Valid UserLoginDTO dto) {
        return userService.login(dto);
    }
}