package micronaut.app;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.micronaut.configuration.kafka.annotation.KafkaKey;
import io.micronaut.configuration.kafka.annotation.KafkaListener;
import io.micronaut.configuration.kafka.annotation.OffsetReset;
import io.micronaut.configuration.kafka.annotation.Topic;
import io.reactivex.Single;

@KafkaListener(offsetReset = OffsetReset.LATEST)
public class KooberKafkaListener {

    private static final Logger LOG = LoggerFactory.getLogger(KooberKafkaListener.class);

    @Topic("koober-messages")
    Single<KobberMessage> receive(@KafkaKey String userType, Single<KobberMessage> message) {
        return message.doOnSuccess(ms -> {
            LOG.info("Received message from kafka. " + ms.toString());
        });
    }

}
