package ch.aschaefer.medixx.legacy.service;

import ch.aschaefer.medixx.legacy.model.Pillen;

import javax.xml.bind.JAXB;
import java.io.InputStream;

/**
 * Created by aschaefer on 19.12.14.
 */
public class LegacyImportService {

    public Pillen read(InputStream input) {
        return JAXB.unmarshal(input, Pillen.class);
    }

}
