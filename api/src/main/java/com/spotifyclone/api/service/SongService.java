package com.spotifyclone.api.service;

import com.spotifyclone.api.dto.SongRequestDTO;
import com.spotifyclone.api.dto.SongResponseDTO;
import com.spotifyclone.api.entity.Album;
import com.spotifyclone.api.entity.Song;
import com.spotifyclone.api.entity.User;
import com.spotifyclone.api.repository.AlbumRepository;
import com.spotifyclone.api.repository.SongRepository;
import com.spotifyclone.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository songRepository;
    private final AlbumRepository albumRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public SongResponseDTO create(SongRequestDTO dto) {
        Album album = albumRepository.findById(dto.getAlbumId())
                .orElseThrow(() -> new RuntimeException("Álbum não encontrado"));

        Song song = modelMapper.map(dto, Song.class);
        song.setAlbum(album);
        song.setId(null);
        Song savedSong = songRepository.save(song);

        User artist = album.getArtist();
        if (!artist.getIsArtist()) {
            artist.setIsArtist(true);
            userRepository.save(artist);
        }

        return modelMapper.map(savedSong, SongResponseDTO.class);
    }

    public List<SongResponseDTO> search(String term) {
        return songRepository.searchByTitleOrArtist(term).stream()
                .map(s -> modelMapper.map(s, SongResponseDTO.class))
                .collect(Collectors.toList());
    }

    public List<SongResponseDTO> findAll() {
        return songRepository.findAll().stream()
                .map(s -> modelMapper.map(s, SongResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long songId) {
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Música não encontrada"));

        Long artistId = song.getAlbum().getArtist().getId();
        songRepository.delete(song);

        // REGRA DE NEGÓCIO: Se não tiver mais músicas, deixa de ser Artista
        long songCount = songRepository.countByAlbumArtistId(artistId);
        if (songCount == 0) {
            User artist = userRepository.findById(artistId).orElseThrow();
            artist.setIsArtist(false);
            userRepository.save(artist);
        }
    }
}