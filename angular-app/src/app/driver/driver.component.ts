import {Component, OnInit} from '@angular/core';

import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss']
})
export class DriverComponent implements OnInit {

  constructor() {
    mapboxgl.accessToken = environment.mapBoxToken;

  }

  ngOnInit(): void {
    var map = new mapboxgl.Map({
      container: 'driverMapDivId',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [21.01,52.23],
      zoom: 11.15
    });
    map.on('load', function () {
      // map.resize();
    });
  }



}
