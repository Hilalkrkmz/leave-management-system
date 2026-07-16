package com.example.izintakipsistemi.security;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {
    // Bu, token'ları imzalamak için kullanılacak gizli anahtar
    private static final String SECRET_KEY = "bu-cok-gizli-bir-anahtar-en-az-32-karakter-olmali-12345";

    // Token'ın gecerlilik suresi (milisaniye) - 10 saat
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 10;

    private Key getSignInKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public String generateToken(String email){
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date((System.currentTimeMillis())))
                .setExpiration(new Date(System.currentTimeMillis()+EXPIRATION_TIME))
                .signWith(getSignInKey(),SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token){
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claims=extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    //token süresi dolmuş mu ve bekledğimiz email mi kontrol ediyor.
    public boolean isTokenValid(String token, String email){
        final String extractedEmail=extractEmail(token);
        return extractedEmail.equals(email) && !isTokenExpired(token);
    }
    // Token'ın expiration bilgisini çıkarıp, şu anki zamandan önce mi diye bakıyor
    private boolean isTokenExpired(String token){
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }
}
