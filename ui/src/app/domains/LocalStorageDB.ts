export class LocalStorageDB {
  mapEntries:MapEntry[] = [];
}

export class MapEntry {
  uuid:string|undefined;
  name:string|undefined;
  lastModification:Date = new Date();
}
