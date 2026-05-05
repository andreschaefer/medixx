package ch.aschaefer.medixx;

import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
public class BuildInfoModelAdvice {

	private final Environment environment;

	public BuildInfoModelAdvice(Environment environment) {
		this.environment = environment;
	}

	@ModelAttribute("medixxVersion")
	public String medixxVersion() {
		return environment.getProperty("git.build.version", "local");
	}

	@ModelAttribute("medixxBuild")
	public String medixxBuild() {
		return environment.getProperty("git.commit.id.abbrev", "local");
	}

	@ModelAttribute("medixxBuildTime")
	public String medixxBuildTime() {
		return environment.getProperty("git.build.time", "");
	}
}