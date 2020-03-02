FROM adoptopenjdk/openjdk13-openj9:jdk-13.0.2_8_openj9-0.18.0-alpine-slim AS builder

ENV APP_HOME /opt/app
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

COPY .mvn $APP_HOME/.mvn
COPY mvnw $APP_HOME/
COPY mvnw.cmd $APP_HOME/
COPY pom.xml $APP_HOME/

RUN  ./mvnw dependency:go-offline

COPY ./src $APP_HOME/src

RUN cd $APP_HOME && ./mvnw clean install

FROM adoptopenjdk/openjdk13-openj9:jdk-13.0.2_8_openj9-0.18.0-alpine-slim AS micronaut-app

ENV APP_HOME /opt/app
RUN mkdir $APP_HOME

COPY --from=builder $APP_HOME/target/micronaut-app-*.jar $APP_HOME/micronaut-app.jar

EXPOSE 8080

WORKDIR $APP_HOME
CMD ["java", "-Dcom.sun.management.jmxremote", "-Xmx128m", "-XX:+IdleTuningGcOnIdle", "-Xtune:virtualized", "-jar", "micronaut-app.jar"]

