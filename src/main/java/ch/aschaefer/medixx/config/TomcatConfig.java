/*
 * Copyright 2000-2014 Namics AG. All rights reserved.
 */

package ch.aschaefer.medixx.config;

import org.apache.catalina.connector.Connector;
import org.springframework.boot.context.embedded.EmbeddedServletContainerFactory;
import org.springframework.boot.context.embedded.tomcat.TomcatEmbeddedServletContainerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.inject.Inject;

/**
 * TomcatConfig.
 *
 * @author aschaefer, Namics AG
 * @since 08.04.14 13:45
 */
@Configuration
public class TomcatConfig {

    public static final String NIO_CONNECTOR = "org.apache.coyote.http11.Http11NioProtocol";

    @Inject
    Environment environment;

    @Bean
    public EmbeddedServletContainerFactory servletContainer() {
        int httpPort = environment.getProperty("httpPort", int.class, 8080);
        int ajpPort = environment.getProperty("ajpPort", int.class, 8009);

        // 8080 + 8443 with classic tomcat structure
        TomcatEmbeddedServletContainerFactory tomcat = new TomcatEmbeddedServletContainerFactory(httpPort);

        // ajp proxy connector
        tomcat.addAdditionalTomcatConnectors(createAjpConnector(ajpPort));

        return tomcat;
    }

    private Connector createAjpConnector(int port) {
        Connector connector = new Connector("org.apache.coyote.ajp.AjpProtocol");
        connector.setPort(port);
        connector.setScheme("ajp");
        return connector;
    }
}
