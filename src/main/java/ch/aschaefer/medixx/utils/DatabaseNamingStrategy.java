/*
 * Copyright 2000-2014 Namics AG. All rights reserved.
 */

package ch.aschaefer.medixx.utils;

import org.hibernate.cfg.ImprovedNamingStrategy;

/**
 * Special naming strategy.
 *
 * @author aschaefer
 * @since 18.02.14 14:46
 */
public class DatabaseNamingStrategy extends ImprovedNamingStrategy {

    public static final String TABLE_PREFIX = "";

    @Override
    public String classToTableName(String className) {
        return TABLE_PREFIX + super.classToTableName(className);
    }

    @Override
    public String logicalCollectionTableName(String tableName, String ownerEntityTable, String associatedEntityTable, String propertyName) {
        return TABLE_PREFIX + super.logicalCollectionTableName(tableName, ownerEntityTable, associatedEntityTable, propertyName);
    }

    @Override
    public String collectionTableName(String ownerEntity, String ownerEntityTable, String associatedEntity, String associatedEntityTable,
                                      String propertyName) {
        return TABLE_PREFIX + super.collectionTableName(ownerEntity, ownerEntityTable, associatedEntity, associatedEntityTable, propertyName);
    }
}
