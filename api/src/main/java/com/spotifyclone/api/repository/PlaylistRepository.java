package com.spotifyclone.api.repository;

import com.spotifyclone.api.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    // Busca todas as playlists públicas para a área de "Explorar"
    List<Playlist> findByIsPublicTrue();

    // Busca playlists de um usuário específico (seja pública ou privada)
    List<Playlist> findByOwnerId(Long ownerId);
}