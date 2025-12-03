package com.spotifyclone.api.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "tb_users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private Boolean isArtist = false;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<Playlist> playlists;


    @OneToMany(mappedBy = "artist", cascade = CascadeType.ALL)
    private List<Album> albums;
}