package ch.aschaefer.medixx.legacy.model;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;

/**
 * Created by aschaefer on 19.12.14.
 */
public class Datum {
    private Integer jahr;
    private Integer tag;
    private Integer monat;

    public Datum() {
    }

    public Datum(Integer jahr, Integer monat, Integer tag) {
        this.jahr = jahr;
        this.monat = monat;
        this.tag = tag;
    }

    @XmlAttribute(name = "Jahr")
    public Integer getJahr() {
        return jahr;
    }

    public void setJahr(Integer jahr) {
        this.jahr = jahr;
    }

    @XmlAttribute(name = "Monat")
    public Integer getMonat() {
        return monat;
    }

    public void setMonat(Integer monat) {
        this.monat = monat;
    }

    @XmlAttribute(name = "Tag")
    public Integer getTag() {
        return tag;
    }

    public void setTag(Integer tag) {
        this.tag = tag;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Datum datum = (Datum) o;

        if (jahr != null ? !jahr.equals(datum.jahr) : datum.jahr != null) return false;
        if (monat != null ? !monat.equals(datum.monat) : datum.monat != null) return false;
        if (tag != null ? !tag.equals(datum.tag) : datum.tag != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = jahr != null ? jahr.hashCode() : 0;
        result = 31 * result + (monat != null ? monat.hashCode() : 0);
        result = 31 * result + (tag != null ? tag.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Datum{" +
                "jahr=" + jahr +
                ", monat=" + monat +
                ", tag=" + tag +
                '}';
    }
}
