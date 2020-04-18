package ch.aschaefer.medixx;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.HashMap;
import java.util.Map;

@ConfigurationProperties("medixx")
public class MedixxProperties {
	private Map<String, String> user = new HashMap<>();

	public Map<String, String> getUser() {
		return user;
	}

	public void setUser(Map<String, String> user) {
		this.user = user;
	}

}
