package com.spotifyclone.api.controller;

import com.spotifyclone.api.dto.SongRequestDTO;
import com.spotifyclone.api.dto.SongResponseDTO;
import com.spotifyclone.api.service.SongService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/songs")
@RequiredArgsConstructor
public class SongController {

    private final SongService songService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SongResponseDTO create(@RequestBody @Valid SongRequestDTO dto) {
        return songService.create(dto);
    }

    @GetMapping
    public List<SongResponseDTO> getAll() {
        return songService.findAll(); // Feed inicial (Home)
    }

    @GetMapping("/search")
    public List<SongResponseDTO> search(@RequestParam("term") String term) {
        return songService.search(term); // Barra de busca
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        songService.delete(id);
    }

    @PutMapping("/{id}")
    public SongResponseDTO update(@PathVariable Long id, @RequestBody @Valid SongRequestDTO dto) {
        return songService.update(id, dto);
    }
}