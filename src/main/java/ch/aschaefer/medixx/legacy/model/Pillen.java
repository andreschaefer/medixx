package ch.aschaefer.medixx.legacy.model;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

/**
 * Created by aschaefer on 19.12.14.
 */

@XmlRootElement(name = "pillen")
public class Pillen {

    private Datum datum;
    private List<Sorte> sorten;

    public Pillen() {
    }

    public Pillen(Datum datum, List<Sorte> sorten) {
        this.datum = datum;
        this.sorten = sorten;
    }

    @XmlElement(name = "Datum")
    public Datum getDatum() {
        return datum;
    }

    public void setDatum(Datum datum) {
        this.datum = datum;
    }

    @XmlElement(name = "Sorte")
    public List<Sorte> getSorten() {
        return sorten;
    }

    public void setSorten(List<Sorte> sorten) {
        this.sorten = sorten;
    }

    public String toString() {
        return "Pillen{" +
                "datum=" + datum +
                ", sorten=" + sorten +
                '}';
    }
}
