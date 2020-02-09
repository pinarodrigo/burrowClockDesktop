import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapboxService {

  positions: any;

  constructor(private httpService: HttpClient) {
    Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set(environment.mapbox.accessToken);
  }

  endpointPositions = 'https://t7bes9gh71.execute-api.eu-central-1.amazonaws.com/dev/position';
  endpointPOIs = 'https://t7bes9gh71.execute-api.eu-central-1.amazonaws.com/dev/locate/';
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  getData(): Observable<any> {
    return this.httpService.get(this.endpointPositions, this.httpOptions).pipe(
      map(this.extractData));
  }

  getPOIs(): Observable<any> {
    return this.httpService.get(this.endpointPOIs, this.httpOptions).pipe(
      map(this.extractData));
  }

  getPOIfor(name: string) {
    return "casa";
  }

  getMarkers(positions) {
    var jsonArrData = JSON.stringify(positions);
    var jsonPositions = JSON.parse(jsonArrData);

    var geojson = [];
    for (let index = 0; index < jsonPositions.positions.length; index++) {
      const element = jsonPositions.positions[index];
      console.log(element.name);
      var featureJson = {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [element.longitude, element.latitude]
        },
        "properties": {
          'message': element.name,
          'description': element.timestamp
        }
      }
      geojson.push(featureJson);
    }
    console.log(geojson);
    return geojson;
  }
}