package com.spotifyclone.api.dto;

import lombok.Data;
import java.util.List;

@Data
public class PlaylistResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Boolean isPublic;
    private String ownerName;

    private List<SongResponseDTO> songs;
}