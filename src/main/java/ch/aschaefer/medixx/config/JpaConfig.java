/*
 * Copyright 2000-2014 Namics AG. All rights reserved.
 */

package ch.aschaefer.medixx.config;

import org.flywaydb.core.Flyway;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaDialect;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.inject.Inject;
import javax.sql.DataSource;
import java.util.Properties;

/**
 * JpaConfig.
 * It's necessary to add entity of i18n module.
 * based on a bug (see https://github.com/spring-projects/spring-boot/issues/1008)
 * Annotation EntityScan doesn't work. This is a workaround to set 'setPackagesToScan'
 *
 * @author lboesch
 * @since 03.09.14 09:19
 */
@Configuration
@EnableJpaRepositories(basePackages = "ch.aschaefer.medixx.repository")
@EnableTransactionManagement
public class JpaConfig {

    @Inject
    protected Environment environment;

    @Bean(name = "entityManagerFactory")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
            @SuppressWarnings("unused") Flyway flyway, /*required to guarantee migration */
            DataSource dataSource
    ) {
        LocalContainerEntityManagerFactoryBean factory = new LocalContainerEntityManagerFactoryBean();
        factory.setDataSource(dataSource);
        factory.setJpaVendorAdapter(jpaVendorAdapter());
        factory.setPackagesToScan("ch.aschaefer.medixx.model");
        factory.setPersistenceUnitName("jpaPersistenceUnit");
        factory.setJpaProperties(jpaProperties());
        factory.setJpaDialect(new HibernateJpaDialect());
        return factory;
    }

    @Bean(name = "jpaProperties")
    public Properties jpaProperties() {
        Properties properties = new Properties();
        properties.setProperty("hibernate.ejb.naming_strategy", "ch.aschaefer.medixx.utils.DatabaseNamingStrategy");
//        properties.setProperty("hibernate.hbm2ddl.auto", "create-drop");
//        properties.setProperty("hibernate.show_sql", "true");
        return properties;
    }

    @Bean
    public HibernateJpaVendorAdapter jpaVendorAdapter() {
        HibernateJpaVendorAdapter adapter = new HibernateJpaVendorAdapter();
        adapter.setShowSql(false);
        return adapter;
    }

    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate();
        jdbcTemplate.setDataSource(dataSource);
        return jdbcTemplate;
    }
}
