/*
 * Copyright 2000-2014 Namics AG. All rights reserved.
 */

package ch.aschaefer.medixx.utils;

/**
 * DataBaseType.
 *
 * @author aschaefer, Namics AG
 * @since 25.04.14 10:25
 */
public enum DatabaseType {

	DERBY("derby"), H2("h2"), HSQL("hsql"), MS_SQL("mssql"), MY_SQL("mysql"), ORACLE("oracle"), TERADATA("teradata");

	private final String shortcut;

	private DatabaseType(String shortcut) {
		this.shortcut = shortcut;
	}

	public String shortcut() {
		return shortcut;
	}

	public String profile() {
		return "DB_" + this.name();
	}
}
