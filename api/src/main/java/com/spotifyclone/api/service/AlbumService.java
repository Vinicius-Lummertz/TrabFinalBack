package com.spotifyclone.api.service;

import com.spotifyclone.api.dto.AlbumRequestDTO;
import com.spotifyclone.api.dto.AlbumResponseDTO;
import com.spotifyclone.api.entity.Album;
import com.spotifyclone.api.entity.User;
import com.spotifyclone.api.repository.AlbumRepository;
import com.spotifyclone.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlbumService {

    private final AlbumRepository albumRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public AlbumResponseDTO create(AlbumRequestDTO dto) {
        User artist = userRepository.findById(dto.getArtistId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Album album = modelMapper.map(dto, Album.class);
        album.setArtist(artist);

        return modelMapper.map(albumRepository.save(album), AlbumResponseDTO.class);
    }

    // Implementar métodos de listar álbuns conforme necessidade
}