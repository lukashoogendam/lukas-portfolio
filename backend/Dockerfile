# =========================================
# Stage 1: Build
# =========================================
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

# Cache Maven dependencies
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Build the application (skip tests for Docker build)
COPY src ./src
RUN ./mvnw package -DskipTests -B

# =========================================
# Stage 2: Run
# =========================================
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy the built JAR
COPY --from=build /app/target/*.jar app.jar

# Create uploads directory and set ownership
RUN mkdir -p uploads && chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
