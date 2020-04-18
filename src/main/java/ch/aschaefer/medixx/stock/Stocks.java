package ch.aschaefer.medixx.stock;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
public class Stocks {
	private String date;
	private List<Stock> stocks = new ArrayList<>();

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public List<Stock> getStocks() {
		return stocks;
	}

	public void setStocks(List<Stock> stocks) {
		this.stocks = stocks;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) {
			return true;
		}
		if (o == null || getClass() != o.getClass()) {
			return false;
		}
		Stocks stocks1 = (Stocks) o;
		return Objects.equals(date, stocks1.date) &&
		       Objects.equals(stocks, stocks1.stocks);
	}

	@Override
	public int hashCode() {
		return Objects.hash(date, stocks);
	}

	@Override
	public String toString() {
		return "Stocks{" +
		       "date='" + date + '\'' +
		       ", stocks=" + stocks +
		       '}';
	}
}
