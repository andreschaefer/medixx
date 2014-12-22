package ch.aschaefer.medixx.rest;

import ch.aschaefer.medixx.model.Medics;
import ch.aschaefer.medixx.model.Stock;
import ch.aschaefer.medixx.repository.MedicsRepository;
import org.joda.time.DateTime;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.util.ArrayList;

/**
 * @author aschaefer
 * @since 19.12.14.
 */
@RestController
public class MedicsController {

    protected final MedicsRepository repository;

    @Inject
    public MedicsController(MedicsRepository repository) {
        this.repository = repository;
    }

    @RequestMapping(value = "/medics/{user}", method = RequestMethod.GET, produces = {"application/json"})
    @PreAuthorize("#user ==  principal.id")
    public Medics getMedics(@PathVariable("user") String user) {
        Medics medics = repository.findOneByUser(user);
        if (medics == null) {
            return new Medics()
                    .id(user)
                    .user(user)
                    .date(DateTime.now())
                    .stocks(new ArrayList<Stock>());
        }
        return medics;
    }

    @RequestMapping(
            value = "/medics/{user}",
            method = RequestMethod.POST,
            consumes = {"application/json"},
            produces = {"application/json"})
    @PreAuthorize("#user == principal.id && #medics.user == principal.id")
    public Medics putMedics(
            @PathVariable("user") String user,
            @RequestBody Medics medics
    ) {
        return repository.save(medics);
    }
}
