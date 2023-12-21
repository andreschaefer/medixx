package ch.aschaefer.medixx;

import ch.aschaefer.medixx.session.SessionSerializationExceptionFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.ExceptionTranslationFilter;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.session.SessionRepository;
import org.springframework.session.security.web.authentication.SpringSessionRememberMeServices;

import java.time.Duration;

import static org.springframework.security.core.userdetails.User.withUsername;

@Configuration
public class SecurityConfiguration {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http,
												   SessionRepository<?> sessionRepository) throws Exception {
		http.authorizeHttpRequests(authorize -> authorize
						.requestMatchers(
								"/css/**",
								"/flaticon/**",
								"/fonts/**",
								"/icon/**",
								"/js/**",
								"/browserconfig.xml",
								"/favicon.ico"
						).permitAll()
						.requestMatchers(HttpMethod.OPTIONS).permitAll()
						.requestMatchers("/require/login").hasAnyAuthority("MEDIXX")
						.requestMatchers("/api/**").hasAnyAuthority("MEDIXX")
						.anyRequest().permitAll())
				.formLogin(form -> form.loginPage("/login"))
				.logout(logout -> logout.logoutUrl("/logout").logoutSuccessUrl("/"))
				.addFilterBefore(new SessionSerializationExceptionFilter(sessionRepository), ExceptionTranslationFilter.class)
				.exceptionHandling(exception -> exception
						.defaultAuthenticationEntryPointFor(new Http403ForbiddenEntryPoint(), new AntPathRequestMatcher("/api/**")))
				.csrf(CsrfConfigurer::disable);

		http.rememberMe(remember -> remember.rememberMeServices(rememberMeServices()));
		return http.build();
	}

	@Bean
	public SpringSessionRememberMeServices rememberMeServices() {
		var rememberMeServices = new SpringSessionRememberMeServices();
		rememberMeServices.setAlwaysRemember(true);
		rememberMeServices.setValiditySeconds((int) Duration.ofDays(365).toSeconds());
		return rememberMeServices;
	}

	@Bean
	public AuthenticationProvider authenticationProvider(InMemoryUserDetailsManager userDetailsService) {
		var provider = new DaoAuthenticationProvider();
		provider.setUserDetailsService(userDetailsService);
		provider.setUserDetailsPasswordService(userDetailsService);
		provider.setPasswordEncoder(PasswordEncoderFactories.createDelegatingPasswordEncoder());
		return provider;
	}

	@Bean
	public InMemoryUserDetailsManager userDetailsService(MedixxProperties medixxProperties) {
		var inMemory = new InMemoryUserDetailsManager();
		medixxProperties.getUser()
				.forEach((name, password) -> inMemory.createUser(withUsername(name)
						.password(password)
						.authorities("MEDIXX")
						.build())
				);
		return inMemory;
	}
}
