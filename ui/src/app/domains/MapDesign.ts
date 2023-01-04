export class MapDesign {
  name:string|undefined;
  notes:string|undefined;
  coordinatesX:number = -472202;
  coordinatesY:number = 7530279;
  zoom:number = 12;
  territoryMapList:TerritoryMap[] = [];
  lastModification:Date|undefined;
}

export class TerritoryMap {
  draft:boolean=true;
  territoryNumber:string='';
  territoryName:string='';
  formerTerritoryNumber:string | null = null;
  simpleFeatureData:string='';
  note:string='';
  lastUpdate:Date=new Date();
}
