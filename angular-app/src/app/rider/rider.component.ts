import {Component, OnInit} from '@angular/core';
import mapboxgl from "mapbox-gl/dist/mapbox-gl";
import {environment} from "../../environments/environment";

import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import {KooberRouteMessage} from "../shared/KooberRouteMessage";
import {IconMarkerFactoryService} from "../shared/icon-marker-factory.service";
import {Title} from "@angular/platform-browser";


@Component({
  selector: 'app-rider',
  templateUrl: './rider.component.html',
  styleUrls: ['./rider.component.scss']
})
export class RiderComponent implements OnInit {

  riderUuid: string = '4321-4321-4321-4321';

  constructor(private iconMarkerFactoryService: IconMarkerFactoryService,
              private titleService: Title) {
    mapboxgl.accessToken = environment.mapBoxToken;
    this.titleService.setTitle("Rider")
  }

  ngOnInit(): void {
    let ws = new WebSocket(environment.apiWebsocketUrl + '/ws/koober/RIDER/' + this.riderUuid);
    let driverMarker;
    const driverIcon = this.iconMarkerFactoryService.createDriverIcon();
    let riderMarker;
    const riderIcon = this.iconMarkerFactoryService.createRiderIcon(false);


    let map = new mapboxgl.Map({
      container: 'riderMapDivId',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [21.01, 52.23],
      zoom: 11.15
    });

    let directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/driving',
      interactive: false
    });

    navigator.geolocation.getCurrentPosition(function (position) {
      map.setCenter([position.coords.longitude, position.coords.latitude]);
    });

    map.addControl(directions, 'top-right');

    map.on('click', function (e) {
      riderMarker = new mapboxgl.Marker(riderIcon, {offset: [-12, -24]}).setLngLat([e.lngLat.lng, e.lngLat.lat]).addTo(map);
      let riderMessage = new KooberRouteMessage(
        "RIDER",
        "RIDER_POSITION",
        e.lngLat.lng,
        e.lngLat.lat,
        null,
        null
      );
      ws.send(JSON.stringify(riderMessage));
    });

    ws.onmessage = function (event) {
      let data: KooberRouteMessage = JSON.parse(event.data);
      if (data.userType == 'DRIVER' && data.messageType == 'DRIVER_POSITION' && data.lng && data.lat) {
        driverMarker = new mapboxgl.Marker(driverIcon, {offset: [-12, -24]}).setLngLat([data.lng, data.lat]).addTo(map);
        if (data.destCoordinates && data.srcCoordinates) {
          directions.setOrigin(data.srcCoordinates);
          directions.setDestination(data.destCoordinates);
        }
      }
    }
  }


}
