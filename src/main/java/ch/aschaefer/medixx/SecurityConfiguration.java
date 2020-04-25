package ch.aschaefer.medixx;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.session.security.web.authentication.SpringSessionRememberMeServices;

import java.time.Duration;

@Configuration
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

	private final MedixxProperties medixxProperties;

	public SecurityConfiguration(MedixxProperties medixxProperties) {
		this.medixxProperties = medixxProperties;
	}

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		var inMemory = auth.inMemoryAuthentication().passwordEncoder(new BCryptPasswordEncoder());
		medixxProperties.getUser().forEach((name, password) -> inMemory.withUser(name).password(password).authorities("MEDIXX").and());
	}

	@Override
	public void configure(WebSecurity web) {
		web.ignoring()
		   .antMatchers(
				   "/css/**",
				   "/flaticon/**",
				   "/fonts/**",
				   "/icon/**",
				   "/js/**",
				   "/browserconfig.xml",
				   "/favicon.ico"
		   );
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.authorizeRequests()
		    .antMatchers(HttpMethod.OPTIONS).permitAll()
		    .antMatchers("/require/login").hasAnyAuthority("MEDIXX")
		    .antMatchers("/api/**").hasAnyAuthority("MEDIXX")
		    .anyRequest().permitAll()
		    .and()
		    .formLogin().loginPage("/login").and()
		    .logout().logoutUrl("/logout").logoutSuccessUrl("/")
		    .and()
		    .exceptionHandling()
		    .defaultAuthenticationEntryPointFor(new Http403ForbiddenEntryPoint(), new AntPathRequestMatcher("/api/**"))
		    .and()
		    .csrf().disable();

		http.rememberMe().rememberMeServices(rememberMeServices());
	}

	@Bean
	public SpringSessionRememberMeServices rememberMeServices() {
		var rememberMeServices = new SpringSessionRememberMeServices();
		rememberMeServices.setAlwaysRemember(true);
		rememberMeServices.setValiditySeconds((int) Duration.ofDays(365).toSeconds());
		return rememberMeServices;
	}

}
