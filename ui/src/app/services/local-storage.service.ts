import { Injectable } from '@angular/core';
import {LocalStorageDB, MapEntry} from "../domains/LocalStorageDB";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  localStorageDB: LocalStorageDB = new LocalStorageDB();

  constructor() { }

  loadUuidInsideLocalStorage():LocalStorageDB {

    let localStorageJsonText = localStorage.getItem("db");

    if (localStorageJsonText != null) {
      this.localStorageDB = JSON.parse(localStorageJsonText);
      console.log(this.localStorageDB)
    }

    return this.localStorageDB;
  }

  saveUuidInsideLocalStorage(uuid:string, name:string|undefined):LocalStorageDB {

    let localStorageJsonText = localStorage.getItem("db");

    if (localStorageJsonText != null) {

      this.localStorageDB = JSON.parse(localStorageJsonText);
      let mapEntry = this.localStorageDB.mapEntries.find(e => e.uuid == uuid);

      if (mapEntry == null) {
        let newMapEntry = new MapEntry();
        newMapEntry.uuid = uuid;
        newMapEntry.lastModification = new Date();
        newMapEntry.name = name;
        this.localStorageDB.mapEntries.push(newMapEntry);
      } else {
        mapEntry.lastModification = new Date();
        mapEntry.name = name;
        this.localStorageDB.mapEntries[this.localStorageDB.mapEntries.findIndex(e => e.uuid == uuid)] = mapEntry;
      }

      localStorage.setItem("db", JSON.stringify(this.localStorageDB));
    } else {
      let localStorageDB = new LocalStorageDB();
      let newMapEntry = new MapEntry();
      newMapEntry.uuid = uuid;
      newMapEntry.name = name;
      newMapEntry.lastModification = new Date();
      localStorageDB.mapEntries.push(newMapEntry);
      localStorage.setItem("db", JSON.stringify(localStorageDB));
    }

    return this.localStorageDB;
  }
}
