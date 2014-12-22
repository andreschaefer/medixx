/*
 * Copyright 2000-2014 Namics AG. All rights reserved.
 */

package ch.aschaefer.medixx.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * WebappConfig.
 *
 * @author aschaefer, Namics AG
 * @since 08.04.14 13:39
 */
@Configuration
@ComponentScan(basePackages = {
        "ch.aschaefer.medixx.repository",
        "ch.aschaefer.medixx.rest",
        "ch.aschaefer.medixx.service",
})
@Import({DataSourceConfig.class, SecurityConfig.class, JpaConfig.class})
public class WebappConfig {


}
