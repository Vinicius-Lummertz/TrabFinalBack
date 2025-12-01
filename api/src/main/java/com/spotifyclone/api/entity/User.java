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

    private String password; // Em produção, usaria BCrypt

    // Regra de negócio: True se tiver pelo menos 1 música publicada
    private Boolean isArtist = false;

    // Relacionamento: Um usuário pode ter várias playlists
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<Playlist> playlists;
}