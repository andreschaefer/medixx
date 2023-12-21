package ch.aschaefer.medixx.session;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.core.serializer.support.SerializationFailedException;
import org.springframework.session.SessionRepository;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.lang.invoke.MethodHandles;

import static org.slf4j.LoggerFactory.getLogger;

public class SessionSerializationExceptionFilter extends OncePerRequestFilter {
	private static final Logger LOG = getLogger(MethodHandles.lookup().lookupClass());
	private final SessionRepository<?> sessionRepository;

	public SessionSerializationExceptionFilter(SessionRepository<?> sessionRepository) {
		this.sessionRepository = sessionRepository;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
		try {
			filterChain.doFilter(request, response);
		} catch (ConversionFailedException e) {
			if (e.getCause() instanceof SerializationFailedException) {
				LOG.warn("Conversion error on persisted session: cleanup repository and invalidate session: {}", e.toString());
				var sessionId = request.getRequestedSessionId();
				if (sessionId != null) {
					invalidateSession(request);
					sessionRepository.deleteById(sessionId);
				}
			}
			throw e;
		}
	}

	private void invalidateSession(HttpServletRequest request) {
		try {
			var session = request.getSession(false);
			if (session != null) {
				session.invalidate();
			}
		} catch (IllegalStateException e) {
			LOG.warn("Failed to invalidate session on serialization issue", e);
		}
	}
}
