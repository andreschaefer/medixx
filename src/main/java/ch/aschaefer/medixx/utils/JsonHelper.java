package ch.aschaefer.medixx.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

import static ch.aschaefer.medixx.utils.ThrowableHierarchyLog.hierarchy;

public final class JsonHelper {
	private static final Logger LOG = LoggerFactory.getLogger(JsonHelper.class);

	private JsonHelper() {
		// hide
	}

	private static final ObjectMapper MAPPER = initMapper();

	private static final ObjectWriter PRETTY_WRITER = initWriter(/*pretty=*/true);
	private static final ObjectWriter INLINE_WRITER = initWriter(/*pretty=*/false);


	/**
	 * Write a specific value to JSON String.
	 *
	 * @param value object to be serialized
	 * @return json representation if serialize success, empty object ({}) else.
	 */
	public static String toJson(Object value) {
		return toJson(value, false);
	}

	/**
	 * create a JSONP representation of the provided object
	 *
	 * @param value    object to serialize
	 * @param callback callback name
	 * @return object rendered as JSONP
	 */
	public static String toJsonP(Object value, String callback) {
		return callback + "(" + toJson(value) + ")";
	}

	/**
	 * Write a specific value to JSON String.
	 *
	 * @param value  object to be serialized
	 * @param pretty enable pretty print
	 * @return json representation if serialize success, empty object ({}) else.
	 */
	public static String toJson(Object value, boolean pretty) {
		try {
			String result;
			if (pretty) {
				result = PRETTY_WRITER.writeValueAsString(value);
			} else {
				result = INLINE_WRITER.writeValueAsString(value);
			}
			LOG.trace("toJson({}) : {}", value, result);
			return result;
		} catch (JsonProcessingException e) {
			LOG.debug("toJson({}) failed: {}", value, hierarchy(e));
			return "{}";
		}
	}

	/**
	 * Restore object from json
	 *
	 * @param json  json to read
	 * @param clazz type to be deserialized
	 * @param <T>   return type
	 * @return read instance of T
	 */
	public static <T> T fromJson(String json, Class<T> clazz) {
		if (json != null) {
			try {
				T result = MAPPER.readValue(json, clazz);
				LOG.debug("fromJson({}) : {}", json, result);
				return result;
			} catch (IOException e) {
				LOG.debug("fromJson({}) failed: {}", json, hierarchy(e));
			}
		}
		return null;
	}

	/**
	 * Restore object from json
	 *
	 * @param json  json to read
	 * @param clazz type to be deserialized
	 * @param <T>   return type
	 * @return read instance of T
	 */
	public static <T> T fromJson(String json, TypeReference<T> clazz) {
		if (json != null) {
			try {
				T result = MAPPER.readValue(json, clazz);
				LOG.debug("fromJson({}) : {}", json, result);
				return result;
			} catch (IOException e) {
				LOG.debug("fromJson({}) failed: {}", json, hierarchy(e));
			}
		}
		return null;
	}

	/**
	 * Convert a random object to another type of Object by serializing to and deserializing from json
	 *
	 * @param source source object
	 * @param clazz  type of target object
	 * @param <T>    return type
	 * @return instance of type T matching the input object
	 */
	public static <T> T convert(Object source, Class<T> clazz) {
		return fromJson(toJson(source), clazz);
	}

	private static ObjectMapper initMapper() {
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.registerModule(new JavaTimeModule());
		mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
		return mapper;
	}

	private static ObjectWriter initWriter(boolean pretty) {
		ObjectMapper mapper = initMapper();
		if (pretty) {
			mapper.enable(SerializationFeature.INDENT_OUTPUT);
		}
		return mapper.writer();
	}
}
