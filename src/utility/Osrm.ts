import Map from 'ol/Map.js';
import { Coordinate } from 'ol/coordinate';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { uuidv4 } from './uuid';
import { transform } from 'ol/proj';


type EventHandler = (data: any) => void;

type TEventNames = 'updatePoints'

type TPointAdd = {
    address?: string,
    coordinate?: Coordinate
}

export interface TPoint extends TPointAdd {
    id: string,
    color: string
}

export default class OsrmNavigator {

    private events: { [key: string]: EventHandler[] };

    map: Map
    layersRouteLayer = new VectorLayer({
        source: new VectorSource({})
    })

    layersRouteSource = this.layersRouteLayer.getSource()

    private layersPointsLayer = new VectorLayer({
        source: new VectorSource({})
    })

    _points: TPoint[] = []

    colors = ["#FF0000", "#FFA500", "#FFFF00", "#008000", "#00FFFF", "#0000FF", "#800080", "#FFC0CB"]


    constructor(map: Map) {
        this.map = map
        this.events = {};
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

    addPoint(_point: TPointAdd) {
        const point: TPoint = {
            ..._point,
            id: uuidv4(),
            color: this.colors[this._points.length]
        }
        this._points.push(point)
        this.emit('updatePoints', this._points);
    }

    removePoint(i: number) {
        this._points.splice(i, 1)
        this.emit('updatePoints', this._points);
    }

    setCoordinatePoint(i: number, coordinate: Coordinate) {
        this._points[i].id = uuidv4()
        this._points[i].coordinate = transform(coordinate, "EPSG:3857", "EPSG:4326")
        this.emit('updatePoints', this._points);
    }

    async getFeatchOsrmApi() {

    }

}
