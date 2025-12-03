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
import org.springframework.transaction.annotation.Transactional;

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

    public AlbumResponseDTO findById(Long id) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Álbum não encontrado"));
        return modelMapper.map(album, AlbumResponseDTO.class);
    }


    public AlbumResponseDTO update(Long id, AlbumRequestDTO dto) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Álbum não encontrado"));

        // Atualiza campos permitidos
        album.setTitle(dto.getTitle());
        album.setReleaseDate(dto.getReleaseDate());

        return modelMapper.map(albumRepository.save(album), AlbumResponseDTO.class);
    }

    //Deletar Álbum (Leva as músicas junto pelo Cascade)
    @Transactional
    public void delete(Long id) {
        if (!albumRepository.existsById(id)) {
            throw new RuntimeException("Álbum não encontrado");
        }
        albumRepository.deleteById(id);
    }
}