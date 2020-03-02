package micronaut.app;

import java.util.Arrays;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KobberMessage {
    public String userType;
    public String messageType;
    public Long lng;
    public Long lat;
    public Long[] srcCoordinates;
    public Long[] destCoordinates;

    @Override
    public String toString() {
        return "KobberMessage{" +
                "userType='" + userType + '\'' +
                "messageType='" + messageType + '\'' +
                ", lng=" + lng +
                ", lat=" + lat +
                ", srcCoordinates=" + Arrays.toString(srcCoordinates) +
                ", destCoordinates=" + Arrays.toString(destCoordinates) +
                '}';
    }
}