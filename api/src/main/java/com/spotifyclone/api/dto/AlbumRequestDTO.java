package com.spotifyclone.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class AlbumRequestDTO {
    @NotBlank
    private String title;

    private LocalDate releaseDate;

    @NotNull(message = "O ID do artista é obrigatório")
    private Long artistId;
}