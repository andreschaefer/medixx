package ch.aschaefer.medixx.utils;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

public class AnonymSerializer extends JsonSerializer<String> {


    @Override
    public void serialize(String value,
                          JsonGenerator gen,
                          SerializerProvider arg2) throws IOException, JsonProcessingException {
        gen.writeString("");
    }
}