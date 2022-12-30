import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {MapDesign} from "../domains/MapDesign";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MapDesignService {

  public static url = `${environment.serverUrl}api.php`;
  constructor(private http:HttpClient) { }

  loadMapDesign(id:string):Observable<MapDesign> {
    return this.http.get<MapDesign>(`${MapDesignService.url}?id=${id}`);
  }

  saveMapDesign(id:string, mapDesign:MapDesign):Observable<string> {
    return this.http.post<string>(`${MapDesignService.url}?id=${id}`, mapDesign);
  }
}
