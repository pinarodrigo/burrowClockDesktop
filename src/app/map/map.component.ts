import { environment } from '../../environments/environment';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapboxService } from '../mapbox.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [MapboxService]
})

export class MapComponent implements OnInit {
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 48.81378173828125;
  lng = 9.14618144069074;

  constructor(private mapBoxService: MapboxService) { }

  ngOnInit() {
    console.log("Drawing Map");
    Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set(environment.mapbox.accessToken);
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 16,
      center: [this.lng, this.lat]
    });


    this.mapBoxService.getData().subscribe((data: {}) => {
      var markers = this.mapBoxService.getMarkers(data);

      markers.forEach(marker => {
        var locationDate = new Date(marker.properties.description*1000);
        new mapboxgl.Marker()
          .setLngLat(marker.geometry.coordinates)
          .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML('<h3>' + marker.properties.message + '</h3><p>' + locationDate + '</p>'))
          .addTo(this.map);
      });
    });

    
    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());

    
  }
}