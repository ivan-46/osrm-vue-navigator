import Map from 'ol/Map.js';
import { Coordinate } from 'ol/coordinate';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { uuidv4 } from './uuid';
import { transform } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';

function getmarker(color: string) {
    let blob = new Blob([`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" version="1.1" style=""><rect id="backgroundrect" width="100%" height="100%" x="0" y="0" fill="none" stroke="none"/><g class="currentLayer" style=""><title>Layer 1</title><path d="M512 85.333333c-164.949333 0-298.666667 133.738667-298.666667 298.666667 0 164.949333 298.666667 554.666667 298.666667 554.666667s298.666667-389.717333 298.666667-554.666667c0-164.928-133.717333-298.666667-298.666667-298.666667z m0 448a149.333333 149.333333 0 1 1 0-298.666666 149.333333 149.333333 0 0 1 0 298.666666z" fill="${color}" id="svg_1" class="selected" stroke-width="8" stroke="#222222" stroke-opacity="1"/></g></svg>`], { type: 'image/svg+xml' });

    return URL.createObjectURL(blob);
}

type EventHandler = (data: any) => void;

type TEventNames = 'updatePoints'

type TPointAdd = {
    address?: string,
    coordinate?: Coordinate
}

export interface TPoint extends TPointAdd {
    id: string,
    color: string,
    feature?: Feature<Point>
}

export default class OsrmNavigator {

    private events: { [key: string]: EventHandler[] };

    map: Map
    layersRouteLayer = new VectorLayer({
        source: new VectorSource({})
    })

    layersRouteSource = this.layersRouteLayer.getSource()

    private layersPointsLayer = new VectorLayer({
        style: null,
        source: new VectorSource({})
    })

    _points: TPoint[] = []

    colors = ["#FF0000", "#FFA500", "#FFFF00", "#008000", "#00FFFF", "#0000FF", "#800080", "#FFC0CB"]


    constructor(map: Map) {
        this.map = map
        this.events = {};
        this.map.addLayer(this.layersPointsLayer)
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

    createFeature(coordinate: Coordinate, color: string) {
        const feature = new Feature({ geometry: new Point(coordinate), })
        feature.setStyle(this.createStyleforPoint(color))
        return feature
    }

    createStyleforPoint(color: string) {
        return [new Style({
            image: new Circle({
                radius: 4,
                fill: new Fill({
                    color: '#0093ff'
                })
            })
        }), new Style({
            image: new Icon({
                src: getmarker(color), anchor: [0.5, 0.9],
                offset: [0, 0],
                scale: 0.04,
            })
        })]
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
        // this._points[i].id = uuidv4() 
        this._points[i].coordinate = transform(coordinate, "EPSG:3857", "EPSG:4326")
        const oldFeature = this._points[i].feature

        if (oldFeature) {
            this.layersPointsLayer.getSource()?.removeFeature(oldFeature)
            this._points[i].feature = undefined
        }

        const feature = this.createFeature(coordinate, this._points[i].color)
        this._points[i].feature = feature

        this.layersPointsLayer.getSource()?.addFeature(feature)

        this.emit('updatePoints', this._points);
    }

    async getFeatchOsrmApi() {

    }

}
