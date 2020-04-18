package ch.aschaefer.medixx;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Controller
public class LoginController {

	@GetMapping("/require/login")
	public String login() {
		return "redirect:/";
	}

	@GetMapping(path = "/api/authenticated", produces = APPLICATION_JSON_VALUE)
	@ResponseBody
	public String authenticated(Authentication authentication) {
		return "\"" + authentication.getName() + "\"";
	}
}
