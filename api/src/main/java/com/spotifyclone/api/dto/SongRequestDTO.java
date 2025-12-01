package com.spotifyclone.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SongRequestDTO {
    @NotBlank
    private String title;

    private Integer durationSeconds;

    @NotBlank(message = "A URL do áudio é obrigatória")
    private String url;

    @NotNull(message = "O ID do álbum é obrigatório")
    private Long albumId;
}