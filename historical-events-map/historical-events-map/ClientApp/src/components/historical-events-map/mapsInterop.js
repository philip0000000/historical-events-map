import './styles.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { basemapLayer } from 'esri-leaflet';
import React, { useEffect } from 'react';

// Fix the default Leaflet marker icon path issue
const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

let map;
let baseLayers;
let markers = [];
let polygons = [];

export const initializeMap = (mapDivId) => {
    map = L.map(mapDivId).setView([47.3529, 10.8565], 5);

    // Define the satellite layer
    let satelliteLayer = basemapLayer('Imagery').addTo(map);
    let imageryLabels = basemapLayer('ImageryLabels');

    // Define the normal layer (let's take 'Streets' as an example)
    let streetsLayer = basemapLayer('Streets');

    let osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Organize layers in an object
    baseLayers = {
        "Satellite": satelliteLayer,
        "Streets": streetsLayer,
        "OpenStreetMap": osmLayer  // Add this line
    };

    let overlays = {
        "Country Labels": imageryLabels
    };

    // Add layer control to the map
    L.control.layers(baseLayers, overlays).addTo(map); // Added overlays here
};

export const addMarker = (lat, lng, popupContent) => {
    let marker = L.marker([lat, lng])
        .bindPopup(popupContent)  // bind a popup to the marker
        .addTo(map);
    markers.push(marker);
};

export const addPolygon = (coords) => {
    let polygon = L.polygon(coords).addTo(map);
    polygons.push(polygon);
};

export const clearMarkers = () => {
    // Clear markers
    for (let marker of markers) {
        map.removeLayer(marker);
    }
    markers = [];

    // Clear polygons
    for (let polygon of polygons) {
        map.removeLayer(polygon);
    }
    polygons = [];
};

const MapComponent = () => {
    return (
        <div id="map" style={{ height: '100%', width: '100%' }}>
        </div>
    );
}

export default MapComponent;
