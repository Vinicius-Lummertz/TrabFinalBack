package com.spotifyclone.api.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "tb_playlists")
public class Playlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    // Regra: Se true, aparece na busca. Se false, só o dono vê.
    private Boolean isPublic = true;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;

    @ManyToMany
    @JoinTable(
            name = "tb_playlist_songs", // Nome da tabela oculta que o Java vai criar
            joinColumns = @JoinColumn(name = "playlist_id"), // Lado da Playlist
            inverseJoinColumns = @JoinColumn(name = "song_id") // Lado da Música
    )
    private List<Song> songs = new ArrayList<>();
}