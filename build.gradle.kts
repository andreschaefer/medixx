buildscript {
    repositories {
        mavenLocal()
        mavenCentral()
        gradlePluginPortal()
        maven { url = uri("https://repo.spring.io/plugins-release") }
    }
}

plugins {
    id("org.springframework.boot") version "2.2.6.RELEASE"
    id("io.spring.dependency-management") version "1.0.9.RELEASE"
    java
    id("com.github.ben-manes.versions") version "0.28.0"
    id("com.gorylenko.gradle-git-properties") version "2.2.2"
    id("net.ltgt.apt-idea") version "0.21"
    id("net.ltgt.apt") version "0.21"
    id("fr.brouillard.oss.gradle.jgitver") version "0.9.0"
}

group = "ch.aschaefer.medixx"
java {
    sourceCompatibility = JavaVersion.VERSION_11
    targetCompatibility = JavaVersion.VERSION_11
}

repositories {
    mavenCentral()
}

dependencyManagement {
    imports {
        mavenBom(org.springframework.boot.gradle.plugin.SpringBootPlugin.BOM_COORDINATES)
    }
}

val developmentOnly = configurations.create("developmentOnly")
configurations.runtimeClasspath.get().extendsFrom(developmentOnly)

dependencies {
    annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")

    implementation("org.flywaydb:flyway-core")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-jdbc")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
    implementation("org.springframework.session:spring-session-jdbc")
    runtimeOnly("com.h2database:h2")
    runtimeOnly("org.postgresql:postgresql")

    developmentOnly("org.springframework.boot:spring-boot-devtools")

    testImplementation("org.springframework.boot:spring-boot-starter-test") {
        exclude(group = "org.junit.vintage", module = "junit-vintage-engine")
    }
    testImplementation("org.springframework.security:spring-security-test")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

springBoot {
    buildInfo()
}
