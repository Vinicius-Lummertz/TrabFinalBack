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
import java.util.List;
import java.util.stream.Collectors;

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
        album.setId(null);
        return modelMapper.map(albumRepository.save(album), AlbumResponseDTO.class);
    }

    public List<AlbumResponseDTO> findAllByArtist(Long artistId) {
        return albumRepository.findByArtistId(artistId).stream()
                .map(album -> modelMapper.map(album, AlbumResponseDTO.class))
                .collect(Collectors.toList());
    }
    // Implementar métodos de listar álbuns conforme necessidade
}