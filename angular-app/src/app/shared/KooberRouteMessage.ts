export class KooberRouteMessage {

  userType: string;
  messageType: string;
  lng: number;
  lat: number;
  srcCoordinates: any;
  destCoordinates: any;

  constructor(userType: string, messageType: string, lng: number, lat: number, srcCoordinates: any, destCooridnates: any) {
    this.userType = userType;
    this.messageType = messageType;
    this.lng = lng;
    this.lat = lat;
    this.srcCoordinates = srcCoordinates;
    this.destCoordinates = destCooridnates;
  }
}
