package ch.aschaefer.medixx;

import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class StockRepositoryInMemory implements StockRepository {

	private static final Map<String, String> store = new ConcurrentHashMap<>();

	// FIXME remove
	static {
		store.put("test", "{\n"
		                  + "\t\"stocks\": [\n"
		                  + "\t\t{\n"
		                  + "\t\t\t\"id\": \"dasdasd\",\n"
		                  + "\t\t\t\"name\": \"dasdasd\",\n"
		                  + "\t\t\t\"stock\": 200,\n"
		                  + "\t\t\t\"consumption\": 1,\n"
		                  + "\t\t\t\"package\": 100,\n"
		                  + "\t\t\t\"date\": \"2020-04-18T11:07:35.983Z\",\n"
		                  + "\t\t\t\"remainingDays\": 0,\n"
		                  + "\t\t\t\"depleted\": \"2020-04-18T11:07:35.983Z\"\n"
		                  + "\t\t}\n"
		                  + "\t],\n"
		                  + "\t\"date\": \"2020-04-18T11:07:35.983Z\"\n"
		                  + "}\n");
	}

	@Override
	public String get(String key) {
		return store.get(key);
	}

	@Override
	public String put(String key, String value) {
		return store.put(key, value);
	}
}
