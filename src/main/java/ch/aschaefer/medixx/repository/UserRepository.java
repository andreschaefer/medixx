/*
 * Copyright 2000-2014 Namics AG. All rights reserved.
 */

package ch.aschaefer.medixx.repository;

import ch.aschaefer.medixx.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * UserRepository.
 *
 * @since 26.08.2014
 */
@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
public interface UserRepository extends JpaRepository<User, String> {

    /**
     * Finds a user by its username ignoring case.
     *
     * @param username .
     * @return .
     */
    @Query("select user from #{#entityName} user where lower(user.username) =  lower(?1)")
    public User findByUsernameIgnoreCase(String username);
}
