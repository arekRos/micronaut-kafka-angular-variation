import {Component, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";

import mapboxgl from "mapbox-gl/dist/mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import * as turf from '@turf/turf'
import {KooberRouteMessage} from "../shared/KooberRouteMessage";
import {IconMarkerFactoryService} from "../shared/icon-marker-factory.service";
import {Title} from "@angular/platform-browser";
import polyline from "google-polyline";
import {LineString} from "@turf/helpers";

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss']
})
export class DriverComponent implements OnInit {

  driverUuid: string = '1234-1234-1234-1234';

  constructor(private iconMarkerFactoryService: IconMarkerFactoryService,
              private titleService: Title) {
    mapboxgl.accessToken = environment.mapBoxToken;
    this.titleService.setTitle("Driver")
  }

  ngOnInit(): void {
    let ws = new WebSocket(environment.apiWebsocketUrl + '/ws/koober/DRIVER/' + this.driverUuid);
    let driverMarker = null;
    const driverIcon = this.iconMarkerFactoryService.createDriverIcon();
    let riderMarker = null;
    const riderIcon = this.iconMarkerFactoryService.createRiderIcon(true);
    let map = new mapboxgl.Map({
      container: 'driverMapDivId',
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
      driverMarker = new mapboxgl.Marker(driverIcon, {offset: [-12, -24]}).setLngLat([position.coords.longitude, position.coords.latitude]).addTo(map);
      map.setCenter([position.coords.longitude, position.coords.latitude]);
    });


    directions.on('route', function (event) {
      let route = event.route[0];
      let metersTraveled = 0;
      let metersPerSecond = route.distance / route.duration;
      // flip from latLng to lngLat
      let coordinates = polyline.decode(route.geometry).map(function (latLng) {
        return [latLng[1], latLng[0]];
      });
      console.info(coordinates);
      let line: LineString = {'type': 'LineString', 'coordinates': coordinates};

      let drivingInterval = window.setInterval(function () {
        if (metersTraveled >= route.distance) {
          window.clearInterval(drivingInterval);
        } else {
          let along = turf.along(line, metersTraveled / 1000, {units: 'kilometers'});
          driverMarker.setLngLat(along.geometry.coordinates);
          metersTraveled = metersTraveled + metersPerSecond;
        }
      }, 1000);
    });

    map.addControl(directions, 'top-right');

    ws.onmessage = function (event) {
      let data: KooberRouteMessage = JSON.parse(event.data);
      if (data.userType == 'RIDER' && data.messageType == 'RIDER_POSITION' && data.lng && data.lat) {
        riderMarker = new mapboxgl.Marker(riderIcon, {offset: [-12, -24]}).setLngLat([data.lng, data.lat]).addTo(map);
        riderIcon.addEventListener('click', function (event) {
          riderIcon.classList.remove('rider-hover');
          riderIcon.classList.add('rider-selected');
          directions.setOrigin(driverMarker.getLngLat().toArray());
          directions.setDestination([data.lng, data.lat]);
        })
      }
    };

    window.setInterval(function () {
      if ((driverMarker != null) && (ws.readyState == 1)) {
        let originPoint = null;
        let destinationPoint = null;
        if (directions) {
          if (directions.getOrigin().geometry && directions.getDestination().geometry) {
            originPoint = directions.getOrigin().geometry.coordinates;
            destinationPoint = directions.getDestination().geometry.coordinates;
          }
        }
        let msg = new KooberRouteMessage(
          "DRIVER",
          "DRIVER_POSITION",
          driverMarker.getLngLat().lng,
          driverMarker.getLngLat().lat,
          originPoint,
          destinationPoint
        );
        ws.send(JSON.stringify(msg))
      }
    }, 2000);
  }


}
