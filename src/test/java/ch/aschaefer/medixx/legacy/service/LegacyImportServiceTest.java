package ch.aschaefer.medixx.legacy.service;

import ch.aschaefer.medixx.legacy.model.Datum;
import ch.aschaefer.medixx.legacy.model.Pillen;
import ch.aschaefer.medixx.legacy.model.Sorte;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.collection.IsIterableContainingInAnyOrder.containsInAnyOrder;
import static org.junit.Assert.assertThat;

public class LegacyImportServiceTest {

    @Test
    public void testRead() throws Exception {
        Pillen pillen = new LegacyImportService().read(this.getClass().getResourceAsStream("/legacy/test.xml"));

        assertThat(pillen, notNullValue());
        assertThat(pillen.getDatum(), is(new Datum(2014, 12, 19)));
        assertThat(pillen.getSorten(), containsInAnyOrder(
                new Sorte("Duplo", 28, 1),
                new Sorte("Lion", 584, 2),
                new Sorte("Bounty", 273, 1),
                new Sorte("Storck Riesen", 264, 1),
                new Sorte("Kinder Riegel", 276, 1),
                new Sorte("Schokohase", 279, 1),
                new Sorte("Twix", 277, 1),
                new Sorte("Schokobons", 394, 3),
                new Sorte("Snickers", 272, 1),
                new Sorte("Toblerone", 95, 1)
        ));
    }
}