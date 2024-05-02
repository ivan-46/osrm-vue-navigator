import Map from 'ol/Map.js';
export { };

declare global {

    interface Window {
        olMap: Map
    }
    
    type EventHandler = (data: any) => void;
}