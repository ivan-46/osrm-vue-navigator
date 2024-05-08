import Map from 'ol/Map.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Collection, Feature } from 'ol';
import { Geometry, Point } from 'ol/geom';
import { Modify, Draw, Select } from 'ol/interaction.js';
import PointRouter from './PointMod';
import { ref } from 'vue';
import { transform } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';

function getRandomColor() {
    const randomRed = Math.floor(Math.random() * 256);
    const randomGreen = Math.floor(Math.random() * 256);
    const randomBlue = Math.floor(Math.random() * 256);
    return `#${randomRed.toString(16).padStart(2, '0')}${randomGreen.toString(16).padStart(2, '0')}${randomBlue.toString(16).padStart(2, '0')}`;
}


type TEventNames = 'updatePoints'


export default class OsrmNavigator {

    private events: { [key: string]: EventHandler[] };

    map: Map
    layersRouteLayer = new VectorLayer({
        source: new VectorSource({}),
        style: new Style({
            stroke: new Stroke({
                width: 3,
                color: "#0087ff"
            })
        })
    })

    layersRouteSource = this.layersRouteLayer.getSource()

    private layersPointsLayer = new VectorLayer({
        style: null,
        source: new VectorSource<Feature<Point>>({})
    })

    _points = ref<PointRouter[]>([])



    modify: Modify | undefined;

    constructor(map: Map) {
        this.map = map
        this.events = {};
        this.map.addLayer(this.layersPointsLayer)
        this.map.addLayer(this.layersRouteLayer)
        const sourceLpoint = this.layersPointsLayer.getSource()

        if (sourceLpoint) {
            this.modify = new Modify({
                source: sourceLpoint
            });
            this.map.addInteraction(this.modify)
        }
    }


    on(eventName: TEventNames, handler: EventHandler) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(handler);
    }

    private emit(eventName: TEventNames, data: any): void {
        const event = this.events[eventName];
        if (event) {
            event.forEach(fn => {
                fn.call(null, data);
            });
        }
    }

    enable() {
        this.map.addLayer(this.layersPointsLayer)
        this.map.addLayer(this.layersRouteLayer)
    }

    disable() {
        this.map.removeLayer(this.layersPointsLayer)
        this.map.removeLayer(this.layersRouteLayer)
    }

    reset() {
        this._points.value = []
        this.layersPointsLayer.getSource()?.clear()
        this.layersRouteLayer.getSource()?.clear()
    }
    getPoints() {
        return this._points
    }

    addPoint() {
        const source = this.layersPointsLayer.getSource()

        if (!source) {
            return
        }

        this._points.value.splice(this._points.value.length - 1, 0, new PointRouter(source, null, getRandomColor()))

    }


    removePoint(i: number) {
        this._points.value.splice(i, 1)
    }



    async getFeatchOsrmApi() {
        const fileterCoordinate = this._points.value.filter(item => item.getCoordinate())
        if (fileterCoordinate.length > 1) {
            const coordinate = fileterCoordinate.map(item => transform(item.getCoordinate() ?? [], 'EPSG:3857', 'EPSG:4326')?.join(",")).join(";")
            fetch(`https://routing.openstreetmap.de/routed-car/route/v1/driving/${coordinate}?overview=full&geometries=geojson`).then(r => r.json()).then(r => {
                this.layersRouteSource?.clear()
                const f = new GeoJSON().readFeature(r.routes[0].geometry, {
                    featureProjection: 'EPSG:3857',
                    dataProjection: 'EPSG:4326'
                })

                this.layersRouteSource?.addFeature(f)
            })
        }

    }

}
