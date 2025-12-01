package com.spotifyclone.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PlaylistRequestDTO {
    @NotBlank
    private String name;
    private String description;
    private Boolean isPublic;

    @NotNull(message = "O ID do dono da playlist é obrigatório")
    private Long ownerId;
}