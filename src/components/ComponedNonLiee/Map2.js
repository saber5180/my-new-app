import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './mapbox-popup.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FiZXI1MTgwIiwiYSI6ImNtOGhqcWs4cTAybnEycXNiaHl6eWgwcjAifQ.8C8bv3cwz9skLXv-y6U3FA';

const Map2 = ({ onPropertiesFound }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const popup = useRef(null);
  const [loading, setLoading] = useState(false);
  const [activeLayers, setActiveLayers] = useState([]);

  const handleAddressClick = async (properties) => {
    try {
      setLoading(true);
      
      if (!properties?.numero || !properties?.nomVoie) {
        throw new Error('Données d\'adresse incomplètes');
      }

      const params = new URLSearchParams({
        novoie: properties.numero.toString(),
        voie: (properties.nomVoie || '').toUpperCase()
      });

      const response = await fetch(`https://immoxperts.apeiron-tech.dev/api/mutations/search?${params}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur API: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      const formattedProperties = data.map(mutation => {
        // Extract values with fallbacks
        const surface = mutation.surface || 1;
        const valeurfonc = mutation.valeurfonc || 0;
        const addressParts = mutation.addresses?.[0]?.split(' ') || [];
        const streetParts = addressParts.slice(0, -3); // Remove postal code and city
        const cityPart = addressParts.slice(-2).join(' '); // Get city and postal code
      
        return {
          id: mutation.idmutation || Date.now(),
          address: streetParts.join(' '),
          city: cityPart || 'Non spécifié',
          // Numeric values for sorting
          numericPrice: valeurfonc,
          numericSurface: surface,
          // Formatted display values
          price: `${Math.round(valeurfonc).toLocaleString('fr-FR')} €`,
          pricePerSqm: Math.round(valeurfonc / surface).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }),
          type: mutation.libtyplocList?.[0]?.replace(/\./g, '') || 'Bien immobilier', // Clean up type names
          surface: `${surface.toLocaleString('fr-FR')} `,
          rooms: mutation.nbpprincTotal || 'N/A',
          soldDate: new Date(mutation.datemut).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          // Raw values for potential filtering
          rawData: {
            terrain: mutation.terrain,
            mutationType: mutation.idnatmut,
            department: mutation.coddep
          }
        };
      });

      if (typeof onPropertiesFound === 'function') {
        onPropertiesFound(formattedProperties);
      }

    } catch (error) {
      console.error('Erreur détaillée:', {
        error,
        properties,
        stack: error.stack
      });
      alert(`Échec de la recherche : ${error.message}`);
      onPropertiesFound?.([]);
    } finally {
      setLoading(false);
    }
  };

  const createPopupContent = (features) => {
    const container = document.createElement('div');
    container.className = 'popup-container';
    
    const title = document.createElement('h3');
    title.className = 'popup-title';
    title.textContent = 'ADDRESSES';
    
    const content = document.createElement('div');
    content.className = 'popup-content';

    features.forEach((feature, index) => {
      const button = document.createElement('button');
      button.className = 'popup-item';
      button.innerHTML = `
        ${feature.properties.numero || 'N/A'} 
        ${(feature.properties.nomVoie || '').toUpperCase()}
      `;

      button.addEventListener('click', (e) => {
        e.stopPropagation();
        if (feature.properties) {
          handleAddressClick({
            numero: feature.properties.numero,
            nomVoie: feature.properties.nomVoie
          });
        }
      });

      content.appendChild(button);
    });

    container.appendChild(title);
    container.appendChild(content);
    return container;
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/saber5180/cm8uhol1600ih01sa3d3d2xjw',
      center: [8.73692, 41.92810],
      zoom: 17,
      attributionControl: false
    });

    map.current.on('load', () => {
      const layers = map.current.getStyle().layers;
      const visibleLayers = layers.filter(layer => 
        layer.type === 'circle' && 
        layer.layout?.visibility !== 'none'
      );

      setActiveLayers(visibleLayers.map(l => l.id));

      visibleLayers.forEach(({ id: layerId }) => {
        map.current.on('click', layerId, (e) => {
          popup.current?.remove();
          popup.current = new mapboxgl.Popup({ offset: 25, closeOnClick: false })
            .setLngLat(e.lngLat)
            .setDOMContent(createPopupContent(e.features))
            .addTo(map.current);
        });
      });
    });

    return () => {
      map.current?.remove();
      popup.current?.remove();
    };
  }, []);

  return (
    <div className="relative h-screen w-full">
      <div ref={mapContainer} className="h-full w-full" />
      
      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center shadow-xl">
            <svg 
              className="animate-spin h-5 w-5 mr-3 text-blue-600" 
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span className="text-gray-700">Recherche des propriétés...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map2;


