package com.courtsphere.courtsphere.jwt;


import com.courtsphere.courtsphere.config.UserPrincipal;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtils{

    private DaoAuthenticationProvider daoAuthenticationProvider;
    private final String SECRET = "dq289y3r89efha9ushdgh958adwgw9gr9ns9egj9ajegwr9uhgs9nega9";
    private final long EXPIRATION  = 86400000;



        public String generateToken(UserPrincipal userPrincipal){
            return Jwts.builder()
                    .setSubject(userPrincipal.getUsername())
                    .claim("userId",userPrincipal.getId())
                    .claim("role",userPrincipal.getAuthorities().iterator().next().getAuthority())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis()+ EXPIRATION))
                    .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()))
                            .compact();

         }

    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        return getClaims(token).getExpiration().after(new Date());
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET.getBytes())
                .parseClaimsJws(token)
                .getBody();
    }



}
