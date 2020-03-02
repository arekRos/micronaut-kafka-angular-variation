package micronaut.app;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.reactivestreams.Publisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Consumes;
import io.micronaut.websocket.WebSocketBroadcaster;
import io.micronaut.websocket.WebSocketSession;
import io.micronaut.websocket.annotation.OnClose;
import io.micronaut.websocket.annotation.OnMessage;
import io.micronaut.websocket.annotation.OnOpen;
import io.micronaut.websocket.annotation.ServerWebSocket;


@ServerWebSocket("/ws/koober/{userType}/{userUuid}")
public class KooberWebSocket {

    private static final Logger LOG = LoggerFactory.getLogger(KooberWebSocket.class);
    private WebSocketBroadcaster broadcaster;
    private KooberKafkaClient kooberKafkaClient;

    public KooberWebSocket(WebSocketBroadcaster broadcaster, KooberKafkaClient kooberKafkaClient) {
        this.broadcaster = broadcaster;
        this.kooberKafkaClient = kooberKafkaClient;
    }

    @OnOpen
    public Publisher<String> onOpen(String userType, String userUuid, WebSocketSession session) {
        LOG.info("User with uuid: {}, registered as: {}", userUuid, userType);
        return broadcaster.broadcast("{}");
    }

    @OnMessage
    @Consumes
    public Publisher<String> onMessage(
            String userType,
            String userUuid,
            String message,
            WebSocketSession session) throws JsonProcessingException {
        LOG.info("User with uuid: {} and type: {}. send message: {}", userUuid, userType, message.toString());
        sendToKafkaTopic(userType, message);
        return broadcaster.broadcast(message, MediaType.APPLICATION_JSON_TYPE);
    }

    private void sendToKafkaTopic(String userType, String message) throws JsonProcessingException {
        KobberMessage kobberMessage = new ObjectMapper().readValue(message, KobberMessage.class);
        kooberKafkaClient.sendKooberMessage(userType, kobberMessage);
    }

    @OnClose
    public Publisher<String> onClose(
            String userType,
            String userUuid,
            WebSocketSession session) {
        LOG.info("User with uuid: {}, left.", userUuid);
        return broadcaster.broadcast("{}}");
    }

}