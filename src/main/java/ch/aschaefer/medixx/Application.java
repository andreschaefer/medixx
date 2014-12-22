package ch.aschaefer.medixx;

import ch.aschaefer.medixx.config.TomcatConfig;
import ch.aschaefer.medixx.config.WebappConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

public class Application extends SpringBootServletInitializer {

    @Configuration
    @EnableAutoConfiguration
    @Import({TomcatConfig.class, WebappConfig.class})
    public static class StandaloneConfig {

    }

    @Configuration
    @EnableAutoConfiguration
    @Import({WebappConfig.class})
    public static class ContainerConfig {

    }

    public static void main(String[] args) throws Exception {
        SpringApplication.run(StandaloneConfig.class, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(ContainerConfig.class);
    }
}