package com.spotifyclone.api.controller;

import com.spotifyclone.api.dto.PlaylistRequestDTO;
import com.spotifyclone.api.dto.PlaylistResponseDTO;
import com.spotifyclone.api.service.PlaylistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/playlists")
@RequiredArgsConstructor
public class PlaylistController {

    private final PlaylistService playlistService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PlaylistResponseDTO create(@RequestBody @Valid PlaylistRequestDTO dto) {
        return playlistService.create(dto);
    }

    @GetMapping("/public")
    public List<PlaylistResponseDTO> listPublicPlaylists() {
        return playlistService.findAllPublic();
    }

    @GetMapping("/user/{userId}")
    public List<PlaylistResponseDTO> listUserPlaylists(@PathVariable Long userId) {
        return playlistService.findByUser(userId);
    }

    @GetMapping("/{id}")
    public PlaylistResponseDTO findById(@PathVariable Long id) {
        return playlistService.findById(id);
    }

    // Adicionar música: POST /playlists/1/songs/5 (Adiciona a música 5 na playlist 1)
    @PostMapping("/{id}/songs/{songId}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // 204 No Content (Deu certo, mas não retorna nada)
    public void addSong(@PathVariable Long id, @PathVariable Long songId) {
        playlistService.addSongToPlaylist(id, songId);
    }

    // Remover música: DELETE /playlists/1/songs/5
    @DeleteMapping("/{id}/songs/{songId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeSong(@PathVariable Long id, @PathVariable Long songId) {
        playlistService.removeSongFromPlaylist(id, songId);
    }

    @PutMapping("/{id}")
    public PlaylistResponseDTO update(@PathVariable Long id, @RequestBody @Valid PlaylistRequestDTO dto) {
        return playlistService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        playlistService.delete(id);
    }
}