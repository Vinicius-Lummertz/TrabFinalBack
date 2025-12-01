package com.spotifyclone.api.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "tb_songs")
public class Song {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private Integer durationSeconds;

    @Column(nullable = false)
    private String url; // A URL do arquivo de áudio (Ex: S3, Google Drive, etc)

    @ManyToOne
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;
}