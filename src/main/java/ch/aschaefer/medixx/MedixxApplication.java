package ch.aschaefer.medixx;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@EnableConfigurationProperties(MedixxProperties.class)
@PropertySource(name = "git.properties", value = "classpath:/git.properties", ignoreResourceNotFound = true)
public class MedixxApplication {

	public static void main(String[] args) {
		SpringApplication.run(MedixxApplication.class, args);
	}

}
