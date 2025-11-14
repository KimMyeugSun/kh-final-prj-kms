package com.kh.team119.security.refresh.token;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "REFRESH_TOKEN",
        uniqueConstraints = {
                @UniqueConstraint(name = "UK_USER_ID", columnNames = {"userId"}),
                @UniqueConstraint(name = "UK_TOKEN", columnNames = {"token"})
        }
)
@Getter
@Builder
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
@AllArgsConstructor(access = lombok.AccessLevel.PRIVATE)
public class RefreshTokenEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "VARCHAR(256)", nullable = false, unique = true)
    private String userId;

    @Column(columnDefinition = "VARCHAR(256)", nullable = false, unique = true)
    private String token;

    @Column(columnDefinition = "TIMESTAMP DEFAULT LOCALTIMESTAMP", nullable = false)
    private LocalDateTime expiry;
}
