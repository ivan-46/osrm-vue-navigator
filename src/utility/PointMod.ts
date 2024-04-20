import { Feature } from "ol";
import { Point } from "ol/geom";
import { uuidv4 } from "./uuid";


//You may need it later

class PointMod extends Feature<Point> {

    getCoordinate() {
        return this.getGeometry()?.getCoordinates()
    }

    private UUID = uuidv4()

    getUUID(): string {
        return this.UUID
    }

    constructor() {
        super() 
    }
}