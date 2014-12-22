package ch.aschaefer.medixx.legacy.model;

import javax.xml.bind.annotation.XmlAttribute;

/**
 * Created by aschaefer on 19.12.14.
 */
public class Sorte {

    private String name;
    private Integer vorrat;
    private Integer verbrauch;

    public Sorte() {
    }

    public Sorte(String name, Integer vorrat, Integer verbrauch) {
        this.name = name;
        this.vorrat = vorrat;
        this.verbrauch = verbrauch;
    }
    @XmlAttribute(name="Name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @XmlAttribute(name="Vorrat")
    public Integer getVorrat() {
        return vorrat;
    }

    public void setVorrat(Integer vorrat) {
        this.vorrat = vorrat;
    }

    @XmlAttribute(name="Verbrauch")
    public Integer getVerbrauch() {
        return verbrauch;
    }

    public void setVerbrauch(Integer verbrauch) {
        this.verbrauch = verbrauch;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Sorte sorte = (Sorte) o;

        if (name != null ? !name.equals(sorte.name) : sorte.name != null) return false;
        if (verbrauch != null ? !verbrauch.equals(sorte.verbrauch) : sorte.verbrauch != null) return false;
        if (vorrat != null ? !vorrat.equals(sorte.vorrat) : sorte.vorrat != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = name != null ? name.hashCode() : 0;
        result = 31 * result + (vorrat != null ? vorrat.hashCode() : 0);
        result = 31 * result + (verbrauch != null ? verbrauch.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Sorte{" +
                "name='" + name + '\'' +
                ", vorrat=" + vorrat +
                ", verbrauch=" + verbrauch +
                '}';
    }
}
