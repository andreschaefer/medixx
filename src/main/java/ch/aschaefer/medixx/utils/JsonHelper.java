package ch.aschaefer.medixx.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

import static ch.aschaefer.medixx.utils.ThrowableHierarchyLog.hierarchy;
import static tools.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES;
import static tools.jackson.databind.cfg.DateTimeFeature.WRITE_DATES_AS_TIMESTAMPS;

public final class JsonHelper {
	private static final Logger LOG = LoggerFactory.getLogger(JsonHelper.class);

	private JsonHelper() {
		// hide
	}

	private static final JsonMapper MAPPER = initMapper();


	/**
	 * Write a specific value to JSON String.
	 *
	 * @param value object to be serialized
	 * @return json representation if serialize success, empty object ({}) else.
	 */
	public static String toJson(Object value) {
		try {
			String result = MAPPER.writeValueAsString(value);
			LOG.trace("toJson({}) : {}", value, result);
			return result;
		} catch (RuntimeException e) {
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
			} catch (RuntimeException e) {
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
			} catch (RuntimeException e) {
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

	private static JsonMapper initMapper() {
		return JsonMapper.builder()
				.configure(FAIL_ON_UNKNOWN_PROPERTIES, false)
				.disable(WRITE_DATES_AS_TIMESTAMPS)
				.build();
	}

}
