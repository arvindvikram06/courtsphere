package com.courtsphere.courtsphere.config;

import com.courtsphere.courtsphere.entity.User;
import com.courtsphere.courtsphere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class CustomUserDetailsService implements UserDetailsService {

    private UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository){
        System.out.println("CustomUserDetailService created");
        this.userRepository = userRepository;
    }

//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//
//        System.out.println(username);
//        User user = userRepository.findByUserName(username)
//                    .orElseThrow(()->new UsernameNotFoundException("user not found"));
//        System.out.println("This");
//        return new UserPrincipal(user);
//
//    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

//        System.out.println("USERNAME RECEIVED BY UDS = [" + username + "]");
        System.out.println("load by user name called");
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("user not found"));

//        System.out.println("DB USERNAME = [" + user.getUserName() + "]");
//        System.out.println("DB PASSWORD = [" + user.getPassword() + "]");

        return new UserPrincipal(user);
    }
}
