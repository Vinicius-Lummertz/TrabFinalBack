package com.spotifyclone.api.service;

// Imports de DTOs e Entidades
import com.spotifyclone.api.dto.PlaylistRequestDTO;
import com.spotifyclone.api.dto.PlaylistResponseDTO;
import com.spotifyclone.api.dto.SongResponseDTO; // Para a lista de músicas
import com.spotifyclone.api.entity.Playlist;
import com.spotifyclone.api.entity.Song; // Importante para o relacionamento
import com.spotifyclone.api.entity.User;

// Imports dos Repositories (O que você perguntou)
import com.spotifyclone.api.repository.PlaylistRepository;
import com.spotifyclone.api.repository.SongRepository; // <--- AQUI ESTÁ ELE
import com.spotifyclone.api.repository.UserRepository;

// Outros imports do Spring e Java
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Para operações de banco seguras

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;


    public PlaylistResponseDTO create(PlaylistRequestDTO dto) {
        User owner = userRepository.findById(dto.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Playlist playlist = modelMapper.map(dto, Playlist.class);
        playlist.setOwner(owner);
        playlist.setId(null);

        return modelMapper.map(playlistRepository.save(playlist), PlaylistResponseDTO.class);
    }


    public List<PlaylistResponseDTO> findAllPublic() {
        return playlistRepository.findByIsPublicTrue().stream()
                .map(p -> modelMapper.map(p, PlaylistResponseDTO.class))
                .collect(Collectors.toList());
    }


    public List<PlaylistResponseDTO> findByUser(Long userId) {
        return playlistRepository.findByOwnerId(userId).stream()
                .map(p -> modelMapper.map(p, PlaylistResponseDTO.class))
                .collect(Collectors.toList());
    }

    private final SongRepository songRepository; // Injete isso no construtor também!

    @Transactional
    public void addSongToPlaylist(Long playlistId, Long songId) {
        // 1. Busca a Playlist
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist não encontrada"));

        // 2. Busca a Música
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Música não encontrada"));

        // 3. Adiciona na lista (se já não estiver lá)
        if (!playlist.getSongs().contains(song)) {
            playlist.getSongs().add(song);
            playlistRepository.save(playlist); // O JPA atualiza a tabela 'tb_playlist_songs'
        }
    }

    @Transactional
    public void removeSongFromPlaylist(Long playlistId, Long songId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist não encontrada"));

        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Música não encontrada"));

        // Remove da lista
        playlist.getSongs().remove(song);
        playlistRepository.save(playlist);
    }

    // Atualização no método findById para retornar as músicas
    public PlaylistResponseDTO findById(Long id) {
        Playlist playlist = playlistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Playlist não encontrada"));
        return modelMapper.map(playlist, PlaylistResponseDTO.class);
    }

    public PlaylistResponseDTO update(Long id, PlaylistRequestDTO dto) {
        Playlist playlist = playlistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Playlist não encontrada"));

        playlist.setName(dto.getName());
        playlist.setDescription(dto.getDescription());
        playlist.setIsPublic(dto.getIsPublic());
        // Não alteramos o dono (owner) na edição por segurança

        return modelMapper.map(playlistRepository.save(playlist), PlaylistResponseDTO.class);
    }

    public void delete(Long id) {
        if (!playlistRepository.existsById(id)) {
            throw new RuntimeException("Playlist não encontrada");
        }
        playlistRepository.deleteById(id);
    }
}