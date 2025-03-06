import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom marker icon
const createCustomMarkerIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: #3B82F6; 
        width: 30px; 
        height: 30px; 
        border-radius: 50%; 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        border: 3px solid white; 
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      ">
        <div style="
          background-color: white; 
          width: 12px; 
          height: 12px; 
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const Map = ({ 
  properties = [], 
  latitude = 48.8566, 
  longitude = 2.3522 
}) => {
  // Calculate center based on properties if available
  const center = properties.length > 0 
    ? [
        properties.reduce((sum, prop) => sum + (prop.latitude || latitude), 0) / (properties.length || 1),
        properties.reduce((sum, prop) => sum + (prop.longitude || longitude), 0) / (properties.length || 1)
      ]
    : [latitude, longitude];

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <MapContainer 
        center={center} 
        zoom={properties.length > 1 ? 10 : 13} 
        className="w-full h-full z-10"
        style={{ height: "100%", width: "100%" }}
      >
        {/* OpenStreetMap Tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Markers for properties */}
        {properties.map((property, index) => (
          property.latitude && property.longitude && (
            <Marker 
              key={index} 
              position={[property.latitude, property.longitude]} 
              icon={createCustomMarkerIcon()}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-sm">{property.address}</h3>
                  <p className="text-xs text-gray-600">{property.price}€ - {property.surface}m²</p>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;