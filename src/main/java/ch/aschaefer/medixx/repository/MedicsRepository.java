package ch.aschaefer.medixx.repository;

import ch.aschaefer.medixx.model.Medics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author aschaefer
 * @since 22.12.14.
 */
@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
public interface MedicsRepository extends JpaRepository<Medics, String> {
    Medics findOneByUser(String user);
}
