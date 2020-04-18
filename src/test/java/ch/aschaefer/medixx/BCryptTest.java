package ch.aschaefer.medixx;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvFileSource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BCryptTest {

	@Disabled("Manual")
	@ParameterizedTest
	@CsvFileSource(resources = "/users.csv")
	void encode(String value) {
		System.out.println("Hash: " + new BCryptPasswordEncoder().encode(value));
	}
}
