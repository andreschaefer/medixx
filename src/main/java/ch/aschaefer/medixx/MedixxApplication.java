package ch.aschaefer.medixx;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(MedixxProperties.class)
public class MedixxApplication {

	public static void main(String[] args) {
		SpringApplication.run(MedixxApplication.class, args);
	}

}
