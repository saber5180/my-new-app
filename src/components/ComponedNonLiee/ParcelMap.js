import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.setTelemetryEnabled(false);
mapboxgl.accessToken = 'pk.eyJ1Ijoic2FiZXI1MTgwIiwiYSI6ImNtOGhqcWs4cTAybnEycXNiaHl6eWgwcjAifQ.8C8bv3cwz9skLXv-y6U3FA';

const ParcelMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const hoveredId = useRef(null);
  const selectedId = useRef(null);

  // Configuration essentielle
  const TILESET_ID = 'saber5180.3oxcv6ps'; // ID du tileset
  const SOURCE_LAYER = 'partaaaaaaaaaaaaaaaaaa1-5qm32j'; // Nom de la source-layer
  const LAYER_ID = 'parcels-interactive-layer'; // Nouveau nom pour votre couche interactive

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/saber5180/cm8uhol1600ih01sa3d3d2xjw',
      center: [8.73692, 41.92810],
      zoom: 17
    });

    map.current.on('load', () => {
      // Ajouter la source vectorielle
      map.current.addSource('parcels-source', {
        type: 'vector',
        url: `mapbox://${TILESET_ID}`
      });

     // In your map.on('load') callback:

// 1. Add the fill layer
map.current.addLayer({
  id: 'parcels-fill',
  type: 'fill',
  source: 'parcels-source',
  'source-layer': 'partaaaaaaaaaaaaaaaaaa1-5qm32j',
  paint: {
    'fill-color': '#f0f0f0',  // Light gray background
    'fill-opacity': 0.5
  }
}, 'road-label');

// 2. Add the outline layer with proper styling
map.current.addLayer({
  id: 'parcels-outline',
  type: 'line',
  source: 'parcels-source',
  'source-layer': 'partaaaaaaaaaaaaaaaaaa1-5qm32j',
  paint: {
    'line-color': '#404040',  // Dark gray lines
    'line-width': 1.5,
    'line-opacity': 0.8
  }
}, 'parcels-fill'); // Place above fill layer
map.current.addLayer({
  id: LAYER_ID,
  type: 'fill',
  source: 'parcels-source',
  'source-layer': SOURCE_LAYER,
  paint: {
    'fill-color': [
      'case',
      ['boolean', ['feature-state', 'selected'], false], // Vérifie d'abord la sélection
      '#2196F3', // Bleu pour sélection
      ['boolean', ['feature-state', 'hover'], false], // Ensuite le survol
      '#CCCCCC', // Gris pour survol
      '#FFFFFF'  // Blanc par défaut
    ],
    'fill-opacity': [
      'case',
      ['boolean', ['feature-state', 'selected'], false],
      0.2,
      ['boolean', ['feature-state', 'hover'], false],
      0.2,
      0.1
    ]
  }
});

      // Gestion du survol
      map.current.on('mousemove', LAYER_ID, (e) => {
        if (e.features.length > 0) {
          const feature = e.features[0];
          const featureId = feature.id;

          if (hoveredId.current) {
            map.current.setFeatureState(
              { 
                source: 'parcels-source',
                sourceLayer: SOURCE_LAYER,
                id: hoveredId.current 
              },
              { hover: false }
            );
          }

          hoveredId.current = featureId;
          map.current.setFeatureState(
            { 
              source: 'parcels-source',
              sourceLayer: SOURCE_LAYER,
              id: featureId 
            },
            { hover: true }
          );
        }
      });

      // Gestion de la sélection
      map.current.on('click', LAYER_ID, (e) => {
        if (e.features.length > 0) {
          const feature = e.features[0];
          const featureId = feature.id;

          if (selectedId.current) {
            map.current.setFeatureState(
              { 
                source: 'parcels-source',
                sourceLayer: SOURCE_LAYER,
                id: selectedId.current 
              },
              { selected: false }
            );
          }

          selectedId.current = featureId;
          map.current.setFeatureState(
            { 
              source: 'parcels-source',
              sourceLayer: SOURCE_LAYER,
              id: featureId 
            },
            { selected: true }
          );
        }
      });

      // Réinitialiser le survol
      map.current.on('mouseleave', LAYER_ID, () => {
        if (hoveredId.current) {
          map.current.setFeatureState(
            { 
              source: 'parcels-source',
              sourceLayer: SOURCE_LAYER,
              id: hoveredId.current 
            },
            { hover: false }
          );
          hoveredId.current = null;
        }
      });
    });

    return () => map.current?.remove();
  }, []);

  return <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />;
};

export default ParcelMap;