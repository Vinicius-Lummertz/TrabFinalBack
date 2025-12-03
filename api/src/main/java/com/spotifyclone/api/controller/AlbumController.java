package com.spotifyclone.api.controller;

import com.spotifyclone.api.dto.AlbumRequestDTO;
import com.spotifyclone.api.dto.AlbumResponseDTO;
import com.spotifyclone.api.service.AlbumService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/albums")
@RequiredArgsConstructor
public class AlbumController {

    private final AlbumService albumService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AlbumResponseDTO create(@RequestBody @Valid AlbumRequestDTO dto) {
        return albumService.create(dto);
    }

    @GetMapping("/artist/{artistId}")
    public List<AlbumResponseDTO> listByArtist(@PathVariable Long artistId) {
        return albumService.findAllByArtist(artistId);
    }
}