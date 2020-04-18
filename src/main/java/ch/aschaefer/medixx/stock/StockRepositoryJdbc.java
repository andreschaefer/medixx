package ch.aschaefer.medixx.stock;

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcOperations;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

import static ch.aschaefer.medixx.utils.JsonHelper.*;

@Repository
public class StockRepositoryJdbc implements StockRepository {

	private final NamedParameterJdbcOperations jdbcTemplate;
	private static final Integer ONE = 1;

	public StockRepositoryJdbc(NamedParameterJdbcOperations jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@Override
	@Transactional(readOnly = true)
	public Stocks get(String key) {
		var data = jdbcTemplate.queryForObject("SELECT STOCK FROM MEDIXX_STOCK WHERE ID=:id", Map.of("id", key), String.class);
		return fromJson(data, Stocks.class);
	}

	@Override
	@Transactional
	public void put(String key, Stocks value) {
		var data = toJson(value);
		if (ONE.equals(count(key))) {
			jdbcTemplate.update("UPDATE MEDIXX_STOCK SET STOCK=:stock WHERE ID=:id", Map.of("id", key, "stock", data));
		} else {
			jdbcTemplate.update("INSERT INTO MEDIXX_STOCK (ID, STOCK) VALUES (:id,:stock)", Map.of("id", key, "stock", data));
		}
	}

	private Integer count(String key) {
		return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM MEDIXX_STOCK WHERE ID=:id", Map.of("id", key), Integer.class);
	}
}
