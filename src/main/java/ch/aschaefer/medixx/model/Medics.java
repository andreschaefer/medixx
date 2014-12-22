package ch.aschaefer.medixx.model;

import ch.aschaefer.medixx.utils.JsDateTimeDeserializer;
import ch.aschaefer.medixx.utils.JsDateTimeSerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.hibernate.annotations.Type;
import org.joda.time.DateTime;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @author aschaefer
 * @since 22.12.14.
 */
@Entity
public class Medics {

    @Id
    private String id;

    @NotNull
    private String user;

    @NotNull
    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentDateTime")
    @JsonSerialize(using = JsDateTimeSerializer.class)
    @JsonDeserialize(using = JsDateTimeDeserializer.class)
    private DateTime date;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<Stock> stocks;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public DateTime getDate() {
        return date;
    }

    public void setDate(DateTime date) {
        this.date = date;
    }

    public List<Stock> getStocks() {
        return stocks;
    }

    public void setStocks(List<Stock> stocks) {
        this.stocks = stocks;
    }


    public Medics id(String id) {
        setId(id);
        return this;
    }

    public Medics user(String user) {
        setUser(user);
        return this;
    }

    public Medics date(DateTime date) {
        setDate(date);
        return this;
    }

    public Medics stocks(List<Stock> stocks) {
        setStocks(stocks);
        return this;
    }
}
