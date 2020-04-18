package ch.aschaefer.medixx.stock;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Objects;

public class Stock {
	private String id;
	private String name;
	private Integer stock;
	private Integer consumption;
	@JsonProperty("package")
	private Integer pgk;
	private String date;
	private Integer remainingDays;
	private String depleted;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getStock() {
		return stock;
	}

	public void setStock(Integer stock) {
		this.stock = stock;
	}

	public Integer getConsumption() {
		return consumption;
	}

	public void setConsumption(Integer consumption) {
		this.consumption = consumption;
	}

	public Integer getPgk() {
		return pgk;
	}

	public void setPgk(Integer pgk) {
		this.pgk = pgk;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public Integer getRemainingDays() {
		return remainingDays;
	}

	public void setRemainingDays(Integer remainingDays) {
		this.remainingDays = remainingDays;
	}

	public String getDepleted() {
		return depleted;
	}

	public void setDepleted(String depleted) {
		this.depleted = depleted;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) {
			return true;
		}
		if (o == null || getClass() != o.getClass()) {
			return false;
		}
		Stock stock1 = (Stock) o;
		return Objects.equals(id, stock1.id) &&
		       Objects.equals(name, stock1.name) &&
		       Objects.equals(stock, stock1.stock) &&
		       Objects.equals(consumption, stock1.consumption) &&
		       Objects.equals(pgk, stock1.pgk) &&
		       Objects.equals(date, stock1.date) &&
		       Objects.equals(remainingDays, stock1.remainingDays) &&
		       Objects.equals(depleted, stock1.depleted);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, name, stock, consumption, pgk, date, remainingDays, depleted);
	}

	@Override
	public String toString() {
		return "Stock{" +
		       "id='" + id + '\'' +
		       ", name='" + name + '\'' +
		       ", stock=" + stock +
		       ", consumption=" + consumption +
		       ", pgk=" + pgk +
		       ", date='" + date + '\'' +
		       ", remainingDays=" + remainingDays +
		       ", depleted='" + depleted + '\'' +
		       '}';
	}
}
