package com.gymflow.service;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.Test;

import io.jsonwebtoken.io.Decoders;

class JwtServiceTest {

    @Test
    void acceptsBase64EncodedSigningKeys() {
        String secret = "Z3ltZmxvdy1kZXZlbG9wbWVudC1qd3Qtc2VjcmV0LWtleS0zMi1ieXRlcw==";

        assertArrayEquals(Decoders.BASE64.decode(secret), JwtService.createSigningKey(secret).getEncoded());
    }

    @Test
    void acceptsLongPlainTextSigningKeys() {
        String secret = "render-generated-plain-text-signing-key-at-least-32-bytes";

        assertArrayEquals(secret.getBytes(StandardCharsets.UTF_8), JwtService.createSigningKey(secret).getEncoded());
    }

    @Test
    void rejectsShortSigningKeys() {
        assertThrows(IllegalArgumentException.class, () -> JwtService.createSigningKey("too-short"));
    }
}