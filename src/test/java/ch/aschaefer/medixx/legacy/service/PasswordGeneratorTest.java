package ch.aschaefer.medixx.legacy.service;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.Assert.assertTrue;

/**
 * @author aschaefer
 * @since 19.12.14.
 */
public class PasswordGeneratorTest {
    @Test
    public void generate(){
        System.out.println(new BCryptPasswordEncoder().encode("password"));
    }

    @Test
    public void verify(){
        assertTrue(new BCryptPasswordEncoder().matches("password", "$2a$10$NMCRRhQ.dk0wUF5NZyLo7epIdhd3N8/WHjfIs7CrBlMCSlZ7tBlPu"));
    }
}
