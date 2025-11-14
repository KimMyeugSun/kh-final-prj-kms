FROM openjdk:17-ea-slim

WORKDIR /team119_final

COPY ./build/libs/*.jar /team119_final/app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/team119_final/app.jar"]
