package ch.aschaefer.medixx;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
public class StockController {
	public static final String MAPPING = "/api/stock/{id}";

	private final StockRepository repository;

	public StockController(StockRepository repository) {
		this.repository = repository;
	}

	@GetMapping(MAPPING)
	public String get(@PathVariable("id") String id,
	                  Authentication authentication) {

		if (authentication == null || !id.equals(authentication.getName())) {
			throw new AccessDeniedException("not permitted");
		}
		return repository.get(id);
	}

	@PostMapping(value = MAPPING, consumes = APPLICATION_JSON_VALUE)
	public void post(@PathVariable("id") String id,
	                 @RequestBody String data,
	                 Authentication authentication) {

		if (authentication == null || !id.equals(authentication.getName())) {
			throw new AccessDeniedException("not permitted");
		}
		repository.put(id, data);
	}

}
