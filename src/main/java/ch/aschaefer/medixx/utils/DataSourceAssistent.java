/*
 * Copyright 2000-2014 Namics AG. All rights reserved.
 */

package ch.aschaefer.medixx.utils;

import org.flywaydb.core.Flyway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.datasource.lookup.DataSourceLookupFailureException;
import org.springframework.util.Assert;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

/**
 * DataSourceAssistent.
 *
 * @author aschaefer
 * @since 28.02.14 10:33
 */
public class DataSourceAssistent {

    private static final Logger LOG = LoggerFactory.getLogger(DataSourceAssistent.class);


    protected final static Map<String, DatabaseType> names = new HashMap<>();

    static {
        names.put("apache derby", DatabaseType.DERBY);
        names.put(DatabaseType.H2.shortcut(), DatabaseType.H2);
        names.put("hsql database engine", DatabaseType.HSQL);
        names.put("microsoft sql server", DatabaseType.MS_SQL);
        names.put("microsoft sql server", DatabaseType.MS_SQL);
        names.put(DatabaseType.MY_SQL.shortcut(), DatabaseType.MY_SQL);
        names.put(DatabaseType.ORACLE.shortcut(), DatabaseType.ORACLE);
        names.put(DatabaseType.TERADATA.shortcut(), DatabaseType.TERADATA);
    }

    protected final static Map<String, String> driverNames = new HashMap<>();

    static {
        driverNames.put("jdbc:mysql:", "com.mysql.jdbc.Driver");
        driverNames.put("jdbc:sqlserver:", "com.microsoft.sqlserver.jdbc.SQLServerDriver");
        driverNames.put("jdbc:jtds:sqlserver:", "net.sourceforge.jtds.jdbc.Driver");
        driverNames.put("jdbc:oracle:thin:", "oracle.jdbc.OracleDriver");
        driverNames.put("jdbc:teradata:", "com.teradata.jdbc.TeraDriver");
        driverNames.put("jdbc:derby:", "org.apache.derby.jdbc.EmbeddedDriver");
        driverNames.put("jdbc:hsqldb:", "org.hsqldb.jdbc.JDBCDriver");
        driverNames.put("jdbc:h2:", "org.h2.Driver");
    }

    /**
     * hide util constructor.
     */
    protected DataSourceAssistent() {
    }

    public static Flyway migrate(DataSource dataSource) {
        try {
            String database = detectDatabaseType(dataSource).shortcut();
            LOG.info("DB detected {}", database);
            Flyway flyway = new Flyway();
            flyway.setDataSource(dataSource);
            flyway.setBaselineOnMigrate(true);
            flyway.setSqlMigrationPrefix("");
            flyway.setIgnoreFailedFutureMigration(true);
            int migrated = flyway.migrate();
            LOG.info("DB migrated, applied {} scripts. {}", migrated, flyway.info().all());
            return flyway;
        } catch (NullPointerException e) {
            throw new DataSourceLookupFailureException("Problem detecting database type", e);
        }
    }

    public static String detectDriverFromUrl(String jdbcUrl) {
        Assert.hasText(jdbcUrl);
        for (Map.Entry<String, String> entry : driverNames.entrySet()) {
            if (jdbcUrl.startsWith(entry.getKey())) {
                return entry.getValue();
            }
        }
        throw new IllegalArgumentException("No known driver for " + jdbcUrl);
    }

    public static DatabaseType detectDatabaseType(DataSource dataSource) {
        String database;
        try (Connection connection = dataSource.getConnection()) {
            database = connection.getMetaData().getDatabaseProductName();
            database = database.toLowerCase();
            if (names.containsKey(database)) {
                return names.get(database);
            }
            connection.commit();
        } catch (SQLException e) {
            throw new DataSourceLookupFailureException("Problem detecting database type", e);
        }
        throw new DataSourceLookupFailureException("Unknown database type '" + database + "', @see " + DataSourceAssistent.class + " and " + DatabaseType.class);
    }

}
