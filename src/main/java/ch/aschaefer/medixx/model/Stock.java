package ch.aschaefer.medixx.model;

import ch.aschaefer.medixx.utils.JsDateTimeDeserializer;
import ch.aschaefer.medixx.utils.JsDateTimeSerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.hibernate.annotations.Type;
import org.joda.time.DateTime;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

/**
 * Model.
 * <pre>
 *     {
 *      "id": "aspirin",
 *      "name": "Aspirin",
 *      "consumption": "3",
 *      "date": "2014-11-01T22:18:56.789Z",
 *      "stock": "60"
 *     }
 * </pre>
 *
 * @author aschaefer
 * @since 19.12.14.
 */
@Entity
public class Stock {
    @Id
    private String id;
    @NotNull
    private String name;
    @NotNull
    private Integer stock;
    @NotNull
    private Integer consumption;

    @NotNull
    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentDateTime")
    @JsonSerialize(using = JsDateTimeSerializer.class)
    @JsonDeserialize(using = JsDateTimeDeserializer.class)
    private DateTime date;

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

    public DateTime getDate() {
        return date;
    }

    public void setDate(DateTime date) {
        this.date = date;
    }


    public Integer getConsumption() {
        return consumption;
    }

    public void setConsumption(Integer consumption) {
        this.consumption = consumption;
    }

    public Stock id(String id) {
        setId(id);
        return this;
    }

    public Stock name(String name) {
        setName(name);
        return this;
    }

    public Stock stock(Integer stock) {
        setStock(stock);
        return this;
    }

    public Stock date(DateTime date) {
        setDate(date);
        return this;
    }

    public Stock consumption(Integer consumption) {
        setConsumption(consumption);
        return this;
    }
}

