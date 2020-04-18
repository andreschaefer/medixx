package ch.aschaefer.medixx.utils;

public class ThrowableHierarchyLog {
	private final Throwable exception;

	private ThrowableHierarchyLog(Throwable exception) {
		this.exception = exception;
	}

	/**
	 * Creates a wrapper object for the throwable providing a toString method only called, when log level is active.
	 *
	 * @param throwable throwable to have a hierarchy toString for
	 * @return instance that provides toString that prints the hierarchy
	 */
	public static ThrowableHierarchyLog hierarchy(Throwable throwable) {
		return new ThrowableHierarchyLog(throwable);
	}

	@Override
	public String toString() {
		if (exception == null) {
			return "";
		}
		StringBuilder builder = new StringBuilder();
		append(builder, exception);
		Throwable cause = exception.getCause();
		while (cause != null) {
			builder.append(" -> ");
			append(builder, cause);
			Throwable deeper = cause.getCause();
			cause = deeper != cause ? deeper : null;
		}
		return builder.toString();
	}

	private void append(StringBuilder builder, Throwable exception) {
		builder.append(exception.getClass().getSimpleName());
		builder.append(":");
		builder.append(exception.getMessage());
	}

}
