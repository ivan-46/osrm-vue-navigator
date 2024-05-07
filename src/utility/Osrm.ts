import Map from 'ol/Map.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Collection, Feature } from 'ol';
import { Geometry, Point } from 'ol/geom';
import { Modify, Draw, Select } from 'ol/interaction.js';
import PointRouter from './PointMod';
import { ref } from 'vue';


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
        source: new VectorSource({})
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

        this._points.value.push(new PointRouter(source, null, getRandomColor()))

    }


    removePoint(i: number) {
        this._points.value.splice(i, 1)
    }



    async getFeatchOsrmApi() {

    }

}
