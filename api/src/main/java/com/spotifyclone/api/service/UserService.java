package com.spotifyclone.api.service;

import com.spotifyclone.api.dto.UserLoginDTO;
import com.spotifyclone.api.dto.UserRequestDTO;
import com.spotifyclone.api.dto.UserResponseDTO;
import com.spotifyclone.api.entity.User;
import com.spotifyclone.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    // 1. Método de Criar Usuário (Cadastro)
    public UserResponseDTO create(UserRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }
        User user = modelMapper.map(dto, User.class);
        user.setIsArtist(false); // Todo mundo começa como ouvinte
        return modelMapper.map(userRepository.save(user), UserResponseDTO.class);
    }

    // 2. Método de Buscar por ID (O que estava faltando!)
    public UserResponseDTO findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return modelMapper.map(user, UserResponseDTO.class);
    }

    // 3. Método de Login (Novo)
    public UserResponseDTO login(UserLoginDTO dto) {
        // Busca por email
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou senha inválidos"));

        // Valida senha (comparação simples para MVP)
        if (!user.getPassword().equals(dto.getPassword())) {
            throw new RuntimeException("Email ou senha inválidos");
        }

        return modelMapper.map(user, UserResponseDTO.class);
    }
}