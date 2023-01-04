import {Component, OnInit} from '@angular/core';
import olMap from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import OSM from 'ol/source/OSM.js';
import XYZ from 'ol/source/XYZ';
import {FormBuilder, FormControl} from "@angular/forms";
import {fromLonLat, toLonLat} from 'ol/proj';
import {Coordinate} from "ol/coordinate";
import {DragAndDrop, Draw, Modify, Select} from "ol/interaction";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {Fill, Stroke, Style, Text} from "ol/style";
import {MapDesign, TerritoryMap} from "../../domains/MapDesign";
import {Geometry} from "ol/geom";
import {Feature} from "ol";
import {GeoJSON, GPX, IGC, TopoJSON, WKT} from "ol/format";
import {ToastrService} from "ngx-toastr";
import {Extent} from "ol/extent";
import KML from "ol/format/KML";
import VectorImageLayer from "ol/layer/VectorImage";
import {Type} from "ol/geom/Geometry";
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MapDesignService} from "../../services/map-design.service";
import {LocalStorageDB, MapEntry} from "../../domains/LocalStorageDB";
import {LocalStorageService} from "../../services/local-storage.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  uuid: string | undefined;
  localStorageDB: LocalStorageDB = new LocalStorageDB();
  map: olMap | null = null;
  view: View = new View();
  vectorLayer: VectorLayer<any> = new VectorLayer<any>();
  coordinateX = new FormControl(48.6974947);
  coordinateY = new FormControl(9.1506559);
  source = new VectorSource();
  interaction: any = null;
  lastSelectedFeature: Feature | undefined = undefined;
  lastSelectedTerritoryMap: TerritoryMap | undefined = undefined;
  lastSavedTerritoryName: string = '';
  importedFeature: Feature | undefined = undefined;
  hideImportedFeature: boolean = true;
  showOsmData: boolean = false;

  styleRedOutline: Style = new Style({
    fill: new Fill({
      color: [0, 0, 0, 0.1]
    }),
    stroke: new Stroke({
      color: [255, 0, 0, 0.5],
      width: 5
    }),
    text: new Text({
      text: '',
      font: '12px Calibri,sans-serif',
      overflow: true,
      fill: new Fill({
        color: '#000',
      }),
      stroke: new Stroke({
        color: '#fff',
        width: 3,
      }),
    })
  });

  styleImported: Style = new Style({
    fill: new Fill({
      color: [0, 0, 0, 0.05]
    }),
    stroke: new Stroke({
      color: [255, 0, 0, 0.25],
      width: 4
    }),
    text: new Text({
      text: '',
      font: '12px Calibri,sans-serif',
      overflow: true,
      fill: new Fill({
        color: '#000',
      }),
      stroke: new Stroke({
        color: '#fff',
        width: 3,
      }),
    })
  });

  styleGreenOutlineActive: Style = new Style({
    fill: new Fill({
      color: [0, 255, 0, 0.1]
    }),
    stroke: new Stroke({
      color: [0, 100, 0, 0.5],
      width: 5
    }),
    text: new Text({
      text: '',
      font: '12px Calibri,sans-serif',
      overflow: true,
      fill: new Fill({
        color: '#007700',
      }),
      stroke: new Stroke({
        color: '#fff',
        width: 2,
      }),
    })
  });

  styleBlueOutlineActive: Style = new Style({
    fill: new Fill({
      color: [0, 255, 0, 0.05]
    }),
    stroke: new Stroke({
      color: [0, 0, 255, 0.05],
      width: 5
    }),
    text: new Text({
      text: '',
      font: '12px Calibri,sans-serif',
      overflow: true,
      fill: new Fill({
        color: '#00c4ff',
      }),
      stroke: new Stroke({
        color: '#fff',
        width: 2,
      }),
    })
  });

  mapDesign: MapDesign = new MapDesign();
  note = new FormControl('');
  territoryNumber = new FormControl('');
  territoryCustomNumber = new FormControl('');
  territoryCustomName = new FormControl('');
  selectInteraction = new Select();
  dragAndDropInteraction = new DragAndDrop({formatConstructors: [GPX, GeoJSON, IGC, KML, TopoJSON],});
  wktFormat = new WKT();
  featureModified = false;
  modeSelected = '';

  mapDesignForm = this.formBuilder.group({
    name: '',
    notes: ''
  });

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private mapDesignService: MapDesignService,
    private formBuilder: FormBuilder,
    private localStorageService:LocalStorageService
  ) {
  }

  ngOnInit(): void {

    this.localStorageDB = this.localStorageService.loadUuidInsideLocalStorage();
    this.mapDesign.lastModification = new Date();

    this.activatedRoute.queryParams.subscribe(params => {
      this.uuid = params['id'];
    });

    if (!this.uuid) {
      this.uuid = crypto.randomUUID();
      const queryParams: Params = {id: this.uuid};

      this.router.navigate(
        [],
        {
          relativeTo: this.activatedRoute,
          queryParams: queryParams,
          queryParamsHandling: 'merge', // remove to replace all query params by provided
        });
    }

    const osmLayer = new TileLayer({
      source: new OSM(),
    });
    osmLayer?.getSource()?.setAttributions([]);

    let that = this;

    this.vectorLayer = new VectorLayer({
      source: this.source,
      style: function (feature) {

        let style = that.styleRedOutline;

        if (!that.showOsmData && feature.get('residentialUnit')) {
          style = new Style({});
        }
        if (that.showOsmData && feature.get('residentialUnit')) {
          style = that.styleBlueOutlineActive;
        } else if (feature.get('imported') && !that.hideImportedFeature) {
          style = that.styleImported;
        } else if (feature.get('imported') && that.hideImportedFeature) {
          style = new Style({});
        } else if (feature.get('draft') == false) {
          style = that.styleGreenOutlineActive;
        }

        if (!(feature.get('imported') || feature.get('residentialUnit'))) {
          // @ts-ignore
          if (that.map.getView().getZoom() > 14) {
            style.getText().setText(feature.get('name'));
          } else {
            style.getText().setText('');
          }
        }
        return style;
      }
    });

    const xyzLayer = new TileLayer({
      source: new XYZ({
        url: 'http://tile.osm.org/{z}/{x}/{y}.png'
      })
    });

    this.view = new View({
      center: [-472202, 7530279],
      zoom: 12
    });
    this.map = new olMap({
      layers: [
        osmLayer,
        this.vectorLayer
      ],
      view: this.view,
      controls: []
    });
  }

  ngAfterViewInit(): void {
    this.map?.setTarget('map');
    this.map?.addInteraction(this.selectInteraction);
    this.map?.addInteraction(this.dragAndDropInteraction);

    this.selectInteraction.on('select', e => {
      if (e.deselected) {
        console.log("deselect")
        this.lastSelectedFeature = undefined;
        this.territoryCustomNumber.setValue(null);
        this.territoryCustomName.setValue(null);
        this.note.setValue(null);
        //return;
      }

      this.lastSelectedFeature = e.selected[0];
      if (this.lastSelectedFeature) {
        this.territoryCustomNumber.setValue(this.lastSelectedFeature.get('territoryNumber'));
        this.territoryCustomName.setValue(this.lastSelectedFeature.get('territoryName'));
        this.note.setValue(this.lastSelectedFeature.get('note'));
      }

      this.mapDesign.territoryMapList.forEach(t => {
        if (t.territoryNumber == this.territoryCustomNumber.value) {
          this.lastSelectedTerritoryMap = t;
        }
      })
    });

    this.dragAndDropInteraction.on('addfeatures', e => {

      // @ts-ignore
      this.importedFeature = e.features[0];
      // @ts-ignore
      this.importedFeature.set('imported');
      let data = this.wktFormat.writeGeometry(<Geometry>this.importedFeature?.getGeometry());

      const vectorSource = new VectorSource({
        // @ts-ignore
        features: e.features,
      });
      this.map?.addLayer(
        new VectorImageLayer({
          source: vectorSource,
        })
      );
      this.map?.getView().fit(vectorSource.getExtent());
    });

    this.loadMap(true);
  }

  loadMap(centerView?: boolean) {

    this.source.clear();

    if (!this.uuid) {
      console.log("UUID not defined!");
      return;
    }

    this.mapDesignService.loadMapDesign(this.uuid).subscribe((mapDesign: MapDesign) => {
        console.log(mapDesign)
        this.loadMapDesignObject(mapDesign);
        if (centerView) {
          this.map?.getView().setCenter([this.mapDesign.coordinatesX, this.mapDesign.coordinatesY]);
          this.map?.getView().setZoom(this.mapDesign.zoom);
        }
      },
      error => {
        if (error.status == 404) {
          console.log("No file found yet!")
        } else {
          console.error(error.status)
        }
      })
  }

  loadMapDesignObject(mapDesign: MapDesign) {
    this.mapDesign = mapDesign;

    let format = new WKT();

    mapDesign.territoryMapList.forEach(territoryMap => {

      let feature = format.readFeature(territoryMap.simpleFeatureData, {
        dataProjection: 'EPSG:3857',
        featureProjection: 'EPSG:3857'
      });
      feature.set('territoryNumber', territoryMap.territoryNumber);
      feature.set('territoryName', territoryMap.territoryName);
      feature.set('note', territoryMap.note);
      feature.set('name', '' + territoryMap.territoryNumber);
      feature.set('draft', territoryMap.draft);
      feature.setId(territoryMap.territoryNumber);
      this.source.addFeature(feature);
    });

    this.featureModified = false;
    this.modeSelected = '';
  }

  saveMap() {

    if (!this.uuid) {
      console.log("UUID not defined!");
      return;
    }

    if (!this.territoryCustomNumber.value) {
      this.toastr.warning("Territory Number is missing!");
      return;
    }

    if (this.territoryNumber.value?.length == 0) {
      this.territoryNumber.setValue(this.territoryCustomNumber.value)
    }

    if (this.lastSelectedFeature != undefined) {

      let territoryMap = new TerritoryMap();

      if (this.lastSelectedFeature.get('territoryNumber') != null) {
        console.log("Former territoryNumber = " + this.lastSelectedFeature.get('territoryNumber'))
        territoryMap.formerTerritoryNumber = this.lastSelectedFeature.get('territoryNumber');
      }

      this.lastSelectedFeature.setProperties([{'territoryNumber': this.territoryNumber.value}]);

      territoryMap.draft = true;
      territoryMap.lastUpdate = new Date();
      if (this.territoryNumber.value) territoryMap.territoryNumber = this.territoryNumber.value;
      if (this.territoryCustomName.value) territoryMap.territoryName = this.territoryCustomName.value;
      if (this.note.value) territoryMap.note = this.note.value;
      this.lastSavedTerritoryName = territoryMap.territoryNumber + ' ' + territoryMap.territoryName;
      let data = this.wktFormat.writeGeometry(<Geometry>this.lastSelectedFeature?.getGeometry());

      if (data == null || data == undefined) {
        data = '';
      }

      territoryMap.simpleFeatureData = data;
      this.mapDesign.territoryMapList.push(territoryMap);

      console.log(this.mapDesign);

      this.lastSelectedFeature = undefined;
    }

    console.log("SAVING ...")
    console.log(this.mapDesign)

    this.mapDesignService.saveMapDesign(this.uuid, this.mapDesign).subscribe(() => {
      this.territoryNumber.setValue('');
      this.loadMap();
      // @ts-ignore
      this.localStorageDB = this.localStorageService.saveUuidInsideLocalStorage(this.uuid);
    })
  }

  setCoordinates() {
    let webMercatorCoordinates = fromLonLat(<number[]>[this.coordinateY.value, this.coordinateX.value]);
    this.map?.getView().setCenter(webMercatorCoordinates);
  }

  getCoordinates(coordinates: number[] | undefined): Coordinate {
    if (coordinates == undefined) return [0, 0];
    return toLonLat(coordinates)
  }

  drawPolygon() {
    this.territoryNumber.setValue('');
    this.addInteraction('Polygon');
    this.modeSelected = 'polygon';
  }

  drawLine() {
    this.territoryNumber.setValue('');
    this.addInteraction('LineString');
    this.modeSelected = 'line';
  }

  drawPoint() {
    this.territoryNumber.setValue('');
    this.addInteraction('Point');
    this.modeSelected = 'point';
  }

  editFeature() {

    if (this.interaction != null) {
      this.removeInteraction();
    }

    this.interaction = new Modify({
      source: this.source
    });

    let modify: Modify = this.interaction;

    modify.on('modifyend', evt => {

      let modifiedFeature = evt.features.getArray()[0];
      this.territoryCustomNumber.setValue(modifiedFeature.get('territoryNumber'));
      this.territoryCustomName.setValue(modifiedFeature.get('territoryName'));
      this.note.setValue(modifiedFeature.get('note'));
      this.lastSavedTerritoryName = this.territoryCustomNumber.value + ' ' + this.territoryCustomName.value;

      this.mapDesign.territoryMapList.forEach(t => {
        if (t.territoryNumber == this.territoryCustomNumber.value) {
          let data = this.wktFormat.writeGeometry(<Geometry>modifiedFeature.getGeometry());
          t.simpleFeatureData = data;
          t.draft = true; // it remains a "draft" until you activate it
          t.lastUpdate = new Date();
          this.featureModified = true;
        }
      })

    });

    this.map?.addInteraction(this.interaction);
    this.modeSelected = 'edit';
  }

  setNavigateMode() {
    this.territoryNumber.setValue('');
    this.removeInteraction();
  }

  private addInteraction(type: Type) {
    this.removeInteraction();
    this.interaction = new Draw({
      type: type,
      source: this.source
    });
    let draw: Draw = this.interaction;
    draw.on('drawend', evt => {
      console.log('draw ended!');
      this.lastSelectedFeature = evt.feature;

      let territoryMap = new TerritoryMap();
      territoryMap.draft = true;
      territoryMap.territoryNumber = String(Date.now());
      territoryMap.lastUpdate = new Date();
      let data = this.wktFormat.writeGeometry(<Geometry>this.lastSelectedFeature?.getGeometry());

      if (data == null || data == undefined) {
        data = '';
      }

      territoryMap.simpleFeatureData = data;

      this.mapDesign.territoryMapList.push(territoryMap);
      this.mapDesign.lastModification = new Date();

      // @ts-ignore
      this.mapDesignService.saveMapDesign(this.uuid, this.mapDesign).subscribe((note: string) => {
        this.toastr.success("Territory map saved!");
        // @ts-ignore
        this.localStorageDB = this.localStorageService.saveUuidInsideLocalStorage(this.uuid);
      });

    });

    this.map?.addInteraction(this.interaction);
    this.modeSelected = 'navigate';
  }

  removeInteraction() {
    this.map?.removeInteraction(this.interaction);
    this.interaction = null;
  }

  setHomeCoordinates() {
    // @ts-ignore
    let center = this.map?.getView().getCenter();
    let zoom = this.map?.getView().getZoom();

    if (zoom) {
      this.mapDesign.zoom = zoom;
    }

    if (center) {
      this.mapDesign.coordinatesX = center[0];
      this.mapDesign.coordinatesY = center[1];
      console.log(this.mapDesign)
      // @ts-ignore
      this.mapDesignService.saveMapDesign(this.uuid, this.mapDesign).subscribe(() => {
        // @ts-ignore
        this.localStorageDB = this.localStorageService.saveUuidInsideLocalStorage(this.uuid);
        this.loadMap();
        this.toastr.info("New center was set!", "Map Service")
      })
    }
  }

  deleteMap() {
    console.log(this.lastSelectedFeature);
    let territoryNumber = this.lastSelectedFeature?.get('number');
    if (!territoryNumber) {
      territoryNumber = this.lastSelectedFeature?.get('territoryNumber');
    }
    let index = this.mapDesign.territoryMapList.findIndex(t => t.territoryNumber == territoryNumber);
    console.log(index);
    if (index) {
      this.mapDesign.territoryMapList.splice(index)
    }

    if (this.lastSelectedFeature) {
      this.source.removeFeature(this.lastSelectedFeature);
    }

    this.mapDesign.lastModification = new Date();

    // @ts-ignore
    this.mapDesignService.saveMapDesign(this.uuid, this.mapDesign).subscribe(() => {
      // @ts-ignore
      this.localStorageDB = this.localStorageService.saveUuidInsideLocalStorage(this.uuid);
      //this.loadMapDesignObject(mapDesign)
    });
  }

  exportKml() {

    let format = new KML({
      'extractStyles': false
    });
    let kmlStyle = "<Document><Style id=\"failed\"><LineStyle><color>bfff55aa</color>" +
      "\t\t\t<width>2</width>\n" +
      "\t\t</LineStyle>\n" +
      "\t\t<PolyStyle>\n" +
      "\t\t\t<color>800055ff</color>\n" +
      "\t\t</PolyStyle>\n" +
      "\t</Style>\n" +
      "\t<Style id=\"failed0\">\n" +
      "\t\t<LineStyle>\n" +
      "\t\t\t<color>bfff55aa</color>\n" +
      "\t\t\t<width>2</width>\n" +
      "\t\t</LineStyle>\n" +
      "\t\t<PolyStyle>\n" +
      "\t\t\t<color>800055ff</color>\n" +
      "\t\t</PolyStyle>\n" +
      "\t</Style>\n" +
      "\t<StyleMap id=\"failed1\">\n" +
      "\t\t<Pair>\n" +
      "\t\t\t<key>normal</key>\n" +
      "\t\t\t<styleUrl>#failed</styleUrl>\n" +
      "\t\t</Pair>\n" +
      "\t\t<Pair>\n" +
      "\t\t\t<key>highlight</key>\n" +
      "\t\t\t<styleUrl>#failed0</styleUrl>\n" +
      "\t\t</Pair>\n" +
      "\t</StyleMap>";
    let kml = format.writeFeatures(this.source.getFeatures(), {featureProjection: 'EPSG:3857'});
    kml = kml.replace("<Document>", kmlStyle);
    kml = kml.replaceAll("<name>", "<styleUrl>#failed1</styleUrl><name>");

    let binaryData = [];
    binaryData.push(kml);
    let downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData));
    downloadLink.setAttribute('download', 'export.kml');
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  setActive() {

    if (this.lastSelectedTerritoryMap != undefined) {

      console.log(this.lastSelectedTerritoryMap)
      this.lastSelectedTerritoryMap.draft = false;
      this.lastSelectedFeature?.set('draft', false);

      this.mapDesign.territoryMapList.forEach(t => {
        if (t.territoryNumber == this.lastSelectedTerritoryMap?.territoryNumber) {
          t.draft = false;

          /*this.mapDesignService.saveMapDesign(this.uuid, this.mapDesign).subscribe((m: MapDesign) => {
            this.territoryNumber.setValue('');
            this.loadMapDesignObject(m);
          });*/
        }
      });

      let territoryNumber = this.lastSelectedTerritoryMap.territoryNumber;
      let territoryName = this.lastSelectedTerritoryMap.territoryName;

      /*this.mapDesignService.setActiveTerritory(territoryNumber, territoryName).subscribe((mapDesign: MapDesign) => {
        this.toastr.success(territoryNumber + ' ' + territoryName + ' is now active!', 'Map Service');
        this.loadMapDesignObject(mapDesign);

      })*/

      this.lastSelectedFeature = undefined;
      this.lastSelectedTerritoryMap = undefined;
    }
  }

  navigateToTerritoryMap(number
                           :
                           any
  ) {
    let feature: Feature<Geometry> | null = this.source.getFeatureById(number);
    if (feature != undefined && feature.getGeometry() != undefined) {
      // @ts-ignore
      let extent: Extent = feature.getGeometry().getExtent();
      this.map?.getView().fit(extent);
    }
  }

  territoryNumberSet() {
    if (this.territoryCustomNumber.value) {
      return this.territoryCustomNumber.value?.length > 0;
    }
    return false;
  }

  getCenterOfExtent(extent
                      :
                      Extent
  ) {
    var X = extent[0] + (extent[2] - extent[0]) / 2;
    var Y = extent[1] + (extent[3] - extent[1]) / 2;
    return [X, Y];
  }

  switchButtons() {

  }
}
