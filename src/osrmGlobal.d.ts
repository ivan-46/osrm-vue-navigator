import Map from 'ol/Map.js';
export {};

declare global {
    interface Window {
        olMap: Map
    }
}