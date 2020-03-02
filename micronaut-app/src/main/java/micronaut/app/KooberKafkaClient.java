package micronaut.app;

import io.micronaut.configuration.kafka.annotation.KafkaClient;
import io.micronaut.configuration.kafka.annotation.KafkaKey;
import io.micronaut.configuration.kafka.annotation.Topic;

@KafkaClient
public interface KooberKafkaClient {

    @Topic("koober-messages")
    void sendKooberMessage(@KafkaKey String userType, KobberMessage message);
}
