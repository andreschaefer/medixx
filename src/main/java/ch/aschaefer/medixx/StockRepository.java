package ch.aschaefer.medixx;

public interface StockRepository {

	String get(String key);
	String put(String key, String value);



}
