package com.spotifyclone.api.dto;

import lombok.Data;

@Data
public class SongResponseDTO {
    private Long id;
    private String title;
    private Integer durationSeconds;
    private String url;

    // Informações do Álbum
    private Long albumId;
    private String albumTitle;

    // Atalho: O ModelMapper consegue ir buscar longe (song.album.artist.name)
    // Se não funcionar automático, configuramos, mas geralmente ele acha.
    private String albumArtistName;
}