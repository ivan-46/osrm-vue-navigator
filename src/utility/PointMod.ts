import { Feature } from "ol";
import { Point } from "ol/geom";
import { uuidv4 } from "./uuid";
import { Coordinate } from "ol/coordinate";
import { transform } from "ol/proj";
import VectorSource from "ol/source/Vector";
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';

function getmarker(color: string) {
    let blob = new Blob([`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" version="1.1" style=""><rect id="backgroundrect" width="100%" height="100%" x="0" y="0" fill="none" stroke="none"/><g class="currentLayer" style=""><title>Layer 1</title><path d="M512 85.333333c-164.949333 0-298.666667 133.738667-298.666667 298.666667 0 164.949333 298.666667 554.666667 298.666667 554.666667s298.666667-389.717333 298.666667-554.666667c0-164.928-133.717333-298.666667-298.666667-298.666667z m0 448a149.333333 149.333333 0 1 1 0-298.666666 149.333333 149.333333 0 0 1 0 298.666666z" fill="${color}" id="svg_1" class="selected" stroke-width="8" stroke="#222222" stroke-opacity="1"/></g></svg>`], { type: 'image/svg+xml' });

    return URL.createObjectURL(blob);
}

//You may need it later



export type TPoint = {
    address: string | null
    coordinate?: Coordinate | null
    id: string
    color: string
}



interface IPointRouter extends TPoint {
    vectorSource: VectorSource<Feature<Point>>,
    feature: Feature<Point> | null
    events: { [key: string]: EventHandler[] };
    emit(eventName: TEventNames, data: any): void
    getCoordinate(): Coordinate | null
    getPoint(): TPoint
    on(eventName: TEventNames, handler: EventHandler): void
    setCoordinatePoint(coordinate: Coordinate): void
}


type TEventNames = 'updatePoint'


export default class PointRouter implements IPointRouter {
    feature: Feature<Point> | null = null;
    address: string | null = null;
    id: string = uuidv4();
    color: string;
    vectorSource: VectorSource<Feature<Point>>;
    events: { [key: string]: EventHandler[] };
    private saveInterval: number = -1
    constructor(vectorSource: VectorSource<Feature<Point>>, feature: Feature<Point> | null, color: string) {
        if (feature) {
            this.feature = feature
        }
        this.vectorSource = vectorSource
        this.color = color
        this.events = {};
    }

    private createFeature(coordinate: Coordinate, color: string) {
        const feature = new Feature({ geometry: new Point(coordinate) })
        feature.on('change', (e) => {
            clearInterval(this.saveInterval)
            this.saveInterval = setTimeout(() => {
                const coordinate4326 = transform(feature.getGeometry()?.getCoordinates() ?? [], "EPSG:3857", "EPSG:4326")
                this.fetchNominatim(coordinate4326)
            }, 50)
        })

        feature.setStyle(this.createStyleforPoint(color))
        return feature
    }


    private createStyleforPoint(color: string) {
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

    on(eventName: TEventNames, handler: EventHandler) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(handler);
    }

    fetchNominatim(coordinate4326: Coordinate) {

        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coordinate4326[1]}&lon=${coordinate4326[0]}&format=json`).then(r => r.json()).then((r?: { display_name: string }) => {
            if (r?.display_name) {
                this.address = r.display_name
            }
        })
            .then(() => {
                this.emit('updatePoint', this.getPoint());
            })
    }

    async setCoordinatePoint(coordinate: Coordinate) {

        const coordinate4326 = transform(coordinate, "EPSG:3857", "EPSG:4326")

        const oldFeature = this.feature

        if (oldFeature) {
            this.vectorSource.removeFeature(oldFeature)
            this.feature = null
        }

        const feature = this.createFeature(coordinate, this.color)
        this.feature = feature

        this.vectorSource.addFeature(feature)

        this.fetchNominatim(coordinate4326)

    }

    emit(eventName: TEventNames, data: any): void {
        const event = this.events[eventName];
        if (event) {
            event.forEach(fn => {
                fn.call(null, data);
            });
        }
    }

    getCoordinate(): Coordinate | null {
        if (this.feature) {
            const coordinates = this.feature.getGeometry()?.getCoordinates()
            if (coordinates) {
                return coordinates
            }
        }
        return null
    }

    getPoint(): TPoint {
        return {
            color: this.color,
            coordinate: this.getCoordinate(),
            address: this.address,
            id: this.id
        }
    }

}