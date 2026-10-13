package com.gymflow.service;

import java.time.Instant;
import java.util.Date;
import java.nio.charset.StandardCharsets;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final SecretKey signingKey;

    public JwtService(@Value("${gymflow.jwt.secret}") String secret) {
        signingKey = createSigningKey(secret);
    }

    static SecretKey createSigningKey(String secret) {
        try {
            byte[] decoded = Decoders.BASE64.decode(secret);
            if (decoded.length >= 32) {
                return Keys.hmacShaKeyFor(decoded);
            }
        } catch (RuntimeException ignored) {
            // Non-Base64 secrets are used as UTF-8 bytes below.
        }

        byte[] raw = secret.getBytes(StandardCharsets.UTF_8);
        if (raw.length < 32) {
            throw new IllegalArgumentException("JWT secret must contain at least 32 bytes.");
        }
        return Keys.hmacShaKeyFor(raw);
    }

    public String createToken(String email) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(email)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(86400)))
                .signWith(signingKey)
                .compact();
    }

    public String readEmail(String token) {
        return Jwts.parser().verifyWith(signingKey).build()
                .parseSignedClaims(token).getPayload().getSubject();
    }
}