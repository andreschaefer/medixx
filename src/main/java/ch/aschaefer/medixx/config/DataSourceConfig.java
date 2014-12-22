/*
 * Copyright 2000-2014 Namics AG. All rights reserved.
 */

package ch.aschaefer.medixx.config;

import ch.aschaefer.medixx.utils.DataSourceAssistent;
import org.flywaydb.core.Flyway;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

/**
 * DataSourceConfig.
 *
 * @author lboesch, Namics AG
 * @since Feb 10, 2014
 */
@Configuration
public class DataSourceConfig {

    protected Flyway dataSource(DataSource dataSource) {
        return DataSourceAssistent.migrate(dataSource);
    }
}
