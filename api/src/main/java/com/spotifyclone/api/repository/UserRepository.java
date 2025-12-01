package com.spotifyclone.api.repository;

import com.spotifyclone.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);

    // NOVO MÉTODO: Busca para o login
    Optional<User> findByEmail(String email);
}