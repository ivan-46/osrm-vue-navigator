import Map from 'ol/Map.js';
import { Coordinate } from 'ol/coordinate';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';



class OsrmNavigator {
    map: Map
    layersRouteLayer = new VectorLayer({
        source: new VectorSource({})
    })

    layersRouteSource = this.layersRouteLayer.getSource()

    layersPointsLayer = new VectorLayer({
        source: new VectorSource({})
    })

    layersPointseSource = this.layersRouteLayer.getSource()

    colors = ["#FF0000", "#FFA500", "#FFFF00", "#008000", "#00FFFF", "#0000FF", "#800080", "#FFC0CB"]

    constructor(map: Map) {
        this.map = map
    }

    addPoint(coordinate: Coordinate) {

    }
    removePoint() {

    }
    async getFeatchOsrmApi() {

    }

}