/*
 * Copyright 2000-2014 Namics AG. All rights reserved.
 */

package ch.aschaefer.medixx.service;

import ch.aschaefer.medixx.model.user.User;
import ch.aschaefer.medixx.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

/**
 * UserDetailServiceImpl.
 *
 * @author lboesch, Namics AG
 * @since 26.08.2014
 */
@Service
public class UserDetailServiceImpl implements UserDetailsService {

    protected final UserRepository userRepository;

    @Inject
    public UserDetailServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameIgnoreCase(username);
        if (user == null) {
            throw new UsernameNotFoundException("No user named " + username);
        }
        return user;
    }

}
