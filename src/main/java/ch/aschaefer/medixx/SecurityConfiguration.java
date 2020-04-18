package ch.aschaefer.medixx;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * SecurityConfiguration.
 *
 * @author aschaefer
 * @since 18.04.20 11:15
 */
@Configuration
@EnableConfigurationProperties(MedixxProperties.class)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

	private final MedixxProperties medixxProperties;

	public SecurityConfiguration(MedixxProperties medixxProperties) {
		this.medixxProperties = medixxProperties;
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.authorizeRequests()
		    .antMatchers(HttpMethod.OPTIONS).permitAll()
		    .antMatchers("/api/**").hasAnyAuthority("MEDIXX")
		    .and()
		    .httpBasic().and()
		    .csrf().disable();
	}

	/**
	 * Configure the authenticatino-manager of this WebSecurityConfigurerAdapter.
	 *
	 * @param auth the authentication-manager builder
	 */
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.parentAuthenticationManager(null);
		var inMemory = auth.inMemoryAuthentication().passwordEncoder(new BCryptPasswordEncoder());
		medixxProperties.getUser().forEach((name, password) -> inMemory.withUser(name).password(password).authorities("MEDIXX").and());
	}


}
