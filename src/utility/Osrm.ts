import Map from 'ol/Map.js';
import { Coordinate } from 'ol/coordinate';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { uuidv4 } from './uuid';


type EventHandler = (data: any) => void;

type TEventNames = 'updatePoints'

type TPointAdd = {
    address?: string,
    coordinate?: Coordinate
}

interface TPoint extends TPointAdd {
    id: string,
    color: string
}

class OsrmNavigator {

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
        this.emit('updatePoints', this.getPoints());
    }

    removePoint(point: TPoint) {
        const i = this._points.indexOf(point)

        if (i >= 0) {
            this._points.splice(i, 1)
        }

        this.emit('updatePoints', this.getPoints());
    }

    async getFeatchOsrmApi() {

    }

}
export default OsrmNavigator