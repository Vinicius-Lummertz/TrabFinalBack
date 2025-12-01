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

    // Criar Playlist
    public PlaylistResponseDTO create(PlaylistRequestDTO dto) {
        User owner = userRepository.findById(dto.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Playlist playlist = modelMapper.map(dto, Playlist.class);
        playlist.setOwner(owner);

        return modelMapper.map(playlistRepository.save(playlist), PlaylistResponseDTO.class);
    }

    // Listar Apenas Públicas (Para o Feed Geral)
    public List<PlaylistResponseDTO> findAllPublic() {
        return playlistRepository.findByIsPublicTrue().stream()
                .map(p -> modelMapper.map(p, PlaylistResponseDTO.class))
                .collect(Collectors.toList());
    }

    // Listar Todas de um Usuário (Perfil dele)
    public List<PlaylistResponseDTO> findByUser(Long userId) {
        return playlistRepository.findByOwnerId(userId).stream()
                .map(p -> modelMapper.map(p, PlaylistResponseDTO.class))
                .collect(Collectors.toList());
    }

    private final SongRepository songRepository; // Injete isso no construtor também!

    @Transactional // Importante: Garante que o banco salve a relação
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
}