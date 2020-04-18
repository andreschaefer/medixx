package ch.aschaefer.medixx.stock;

public interface StockRepository {

	Stocks get(String key);
	void put(String key, Stocks value);



}
