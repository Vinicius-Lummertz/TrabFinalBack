package com.spotifyclone.api.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class AlbumResponseDTO {
    private Long id;
    private String title;
    private LocalDate releaseDate;
    // O ModelMapper vai pegar automaticamente o user.getId()
    private Long artistId;

    // O ModelMapper vai pegar automaticamente o user.getName()
    private String artistName;

    private List<SongResponseDTO> songs;
}