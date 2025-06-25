package com.innosync.service;

import com.innosync.model.User;
import com.innosync.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private UserRepository userRepository;
    public Optional<User> getUser(String email) {
        return userRepository.findByEmail(email);
    }
}
