package com.courtsphere.courtsphere.config;

import com.courtsphere.courtsphere.jwt.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtils jwtUtil,
                                   CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        System.out.println("JwtAuthentication filter created");
    }
//    @Override
//    protected boolean shouldNotFilter(HttpServletRequest request) {
//
//        String path = request.getRequestURI();
//
//        return path.startsWith("/auth/")
//                || path.startsWith("/swagger-ui/")
//                || path.startsWith("/v3/api-docs");
//    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        // If no Authorization header → just continue
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        String username = jwtUtil.extractUsername(token);

        if (username != null &&
                SecurityContextHolder.getContext().getAuthentication() == null &&
                jwtUtil.isTokenValid(token)) {

            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(username);

            System.out.println("creating new token");
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
}
