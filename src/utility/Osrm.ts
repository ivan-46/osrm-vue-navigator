import Map from 'ol/Map.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Collection, Feature } from 'ol';
import { Geometry, Point } from 'ol/geom';
import { Modify, Draw, Select } from 'ol/interaction.js';
import PointRouter from './PointMod';





type TEventNames = 'updatePoints'


export default class OsrmNavigator {

    private events: { [key: string]: EventHandler[] };

    map: Map
    layersRouteLayer = new VectorLayer({
        source: new VectorSource({})
    })

    layersRouteSource = this.layersRouteLayer.getSource()

    private layersPointsLayer = new VectorLayer({
        style: null,
        source: new VectorSource<Feature<Point>>({})
    })

    _points: PointRouter[] = []

    colors = ["#FF0000", "#FFA500", "#FFFF00", "#008000", "#00FFFF", "#0000FF", "#800080", "#FFC0CB"]

    modify: Modify | undefined;

    constructor(map: Map) {
        this.map = map
        this.events = {};
        this.map.addLayer(this.layersPointsLayer)
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


    getPoints() {
        return this._points
    }

    addPoint() {
        const source = this.layersPointsLayer.getSource()

        if (!source) {
            return
        }

        this._points.push(new PointRouter(source, null, this.colors[this._points.length]))
        this.emit('updatePoints', this._points);
    }


    removePoint(i: number) {
        this._points.splice(i, 1)
        this.emit('updatePoints', this._points);
    }



    async getFeatchOsrmApi() {

    }

}
