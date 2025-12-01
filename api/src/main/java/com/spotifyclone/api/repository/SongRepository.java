package com.spotifyclone.api.repository;

import com.spotifyclone.api.entity.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {

    // Busca por Título da música OU Nome do Artista (User)
    @Query("SELECT s FROM Song s WHERE LOWER(s.title) LIKE LOWER(CONCAT('%', :term, '%')) OR LOWER(s.album.artist.name) LIKE LOWER(CONCAT('%', :term, '%'))")
    List<Song> searchByTitleOrArtist(@Param("term") String term);

    // Conta quantas músicas um artista tem (para a lógica de downgrade)
    long countByAlbumArtistId(Long artistId);
}