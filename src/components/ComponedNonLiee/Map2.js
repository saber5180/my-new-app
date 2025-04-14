import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './mapbox-popup.css';
import axios from 'axios';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FiZXI1MTgwIiwiYSI6ImNtOGhqcWs4cTAybnEycXNiaHl6eWgwcjAifQ.8C8bv3cwz9skLXv-y6U3FA';

const Map2 = ({ onPropertiesFound }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const popup = useRef(null);
  const hoverPopup = useRef(null);
  const [loading, setLoading] = useState(false);
  const [activeLayers, setActiveLayers] = useState([]);
  const [showStatsPanel, setShowStatsPanel] = useState(true);
  const [currentCity, setCurrentCity] = useState('Ajaccio');


  const [propertyStats, setPropertyStats] = useState([]);
  const [activePropertyType, setActivePropertyType] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  // Fonction de normalisation améliorée
  const normalizeSearchParams = (str) => {
    return typeof str === 'string'
      ? str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[œæ]/gi, 'oe')
        .replace(/[ç]/gi, 'c')
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
      : '';
  };


 // Déplacer le useEffect de géocodage APRÈS l'initialisation de la carte
useEffect(() => {
  if (!map.current) return;

  const updateLocationName = async () => {
    try {
      const center = map.current.getCenter();
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${center.lng},${center.lat}.json?types=place,locality&language=fr&access_token=${mapboxgl.accessToken}`
      );
      
      const data = await response.json();
      const locationFeature = data.features[0];
      
      if (locationFeature) {
        const locationName = locationFeature.text_fr || locationFeature.text;
        console.log('Localisation:', locationName);
        setCurrentCity(locationName);
      }
    } catch (error) {
      console.error('Erreur de géocodage:', error);
    }
  };

  // Ajouter les listeners directement sur la carte initialisée
  map.current.on('moveend', updateLocationName);
  map.current.on('zoomend', updateLocationName);

  return () => {
    if (map.current) {
      map.current.off('moveend', updateLocationName);
      map.current.off('zoomend', updateLocationName);
    }
  };
}, [map.current]); // Ajouter map.current comme dépendance

  const fetchAddressData = async (properties) => {
    try {
      // Normalisation des paramètres
      const numero = normalizeSearchParams(properties.numero?.toString());
      const nomVoie = normalizeSearchParams(properties.nomVoie);

      if (!numero || !nomVoie) {
        throw new Error('Données d\'adresse incomplètes');
      }

      // Création des paramètres de recherche
      const params = new URLSearchParams({
        novoie: numero.replace(/\D/g, ''), // Supprime tout sauf les chiffres
        voie: nomVoie
      });

      const response = await fetch(`https://immoxperts.apeiron-tech.dev/api/mutations/search?${params}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur API: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      const formattedProperties = data.map(mutation => {
        const surface = mutation.surface || 1;
        const valeurfonc = mutation.valeurfonc || 0;
        const rawAddress = mutation.addresses?.[0] || '';

        // Traitement amélioré de l'adresse
        const addressParts = rawAddress.split(' ');
        const streetNumber = addressParts.find(part => /^\d+/.test(part)) || '';
        const streetNameParts = addressParts.filter(part => part !== streetNumber && !/^\d{5}/.test(part));
        const cityParts = addressParts.slice(-2); // Code postal + ville

        return {
          id: mutation.idmutation || Date.now(),
          address: `${streetNumber} ${streetNameParts.join(' ')}`, // Numéro + nom de voie complet
          city: cityParts.join(' '), // Code postal + ville
          numericPrice: valeurfonc,
          numericSurface: surface,
          price: `${Math.round(valeurfonc).toLocaleString('fr-FR')} €`,
          pricePerSqm: `${Math.round(valeurfonc / surface).toLocaleString('fr-FR')} €`,
          type: (mutation.libtyplocList?.[0] || 'Terrain')
            .replace(/\./g, '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''),
          surface: `${surface.toLocaleString('fr-FR')} m²`,
          rooms: mutation.nbpprincTotal ?? 'N/A',
          soldDate: new Date(mutation.datemut).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          rawData: {
            terrain: mutation.terrain,
            mutationType: mutation.idnatmut,
            department: mutation.coddep
          }
        };
      });

      return formattedProperties;
    } catch (error) {
      console.error('Erreur:', error);
      return [];
    }
  };

  const handleAddressClick = async (properties) => {
    try {
      setLoading(true);
      onPropertiesFound?.([]);

      const formattedProperties = await fetchAddressData(properties);
      onPropertiesFound?.(formattedProperties);

    } catch (error) {
      console.error('Erreur:', error);
      alert(`Échec de la recherche : ${error.message}`);
      onPropertiesFound?.([]);
    } finally {
      setLoading(false);
    }
  };

  const createHoverPopupContent = async (properties) => {
    const container = document.createElement('div');
    container.className = 'popup-container';

    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'flex items-center justify-center p-4';
    loadingIndicator.innerHTML = `
      <svg class="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
      <span class="ml-2 text-sm">Chargement...</span>
    `;
    container.appendChild(loadingIndicator);

    // Fetch the data for this address in the background
    const formattedProperties = await fetchAddressData(properties);

    // Replace loading indicator with actual content
    if (formattedProperties.length > 0) {
      container.innerHTML = '';

      const property = formattedProperties[0];

      // Format the address with street number and name
      const formattedAddress = `${property.address.toUpperCase()} - ${property.city.split(' ')[1] || ''}`;

      // Format the price
      const priceFormatted = property.numericPrice.toLocaleString('fr-FR') + ' €';

      // Format the price per square meter
      const pricePerSqm = Math.round(property.numericPrice / property.numericSurface).toLocaleString('fr-FR') + ' €/m²';

      container.innerHTML = `
      <div class="popup-header">
        <h3>${formattedAddress}</h3>
        <span class="price">${priceFormatted}</span>
      </div>

      <div class="property-type">
        ${property.type}
      </div>

      <div class="property-details">
        <div class="property-detail">
          <span class="detail-label">Pièces</span>
          <span class="detail-value">${property.rooms}</span>
        </div>

        <div class="property-detail">
          <span class="detail-label">Surface</span>
          <span class="detail-value">${property.surface}</span>
        </div>

        <div class="property-detail">
          <span class="detail-label">Terrain</span>
          <span class="detail-value">${property.rawData.terrain ? property.rawData.terrain + ' m²' : 'N/A'}</span>
        </div>

        <div class="property-detail">
          <span class="detail-label">Vendu le</span>
          <span class="detail-value">${property.soldDate.split(' ')[0]}</span>
        </div>
      </div>

      <div class="price-per-sqm">
        ${pricePerSqm}
      </div>

      <div class="popup-button-container">
        <button class="popup-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          Analyser cette adresse
        </button>
      </div>
    `;

      // Gestionnaire d'événement pour le bouton
      container.querySelector('.popup-button').addEventListener('click', (e) => {
        e.stopPropagation();
        handleAddressClick(properties);
        hoverPopup.current?.remove();
      });
    } else {
      container.innerHTML = `
        <div class="p-3">
          <p class="text-sm">Aucune mutation trouvée pour cette adresse.</p>
        </div>
      `;
    }

    return container;
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
    map.current.addControl(new mapboxgl.ScaleControl({
      unit: 'metric'
    }), 'top-right');


    map.current.on('load', () => {

      const layers = map.current.getStyle().layers;
      const visibleLayers = layers.filter(layer =>
        layer.type === 'circle' &&
        layer.layout?.visibility !== 'none'
      );

      setActiveLayers(visibleLayers.map(l => l.id));

      visibleLayers.forEach(({ id: layerId }) => {
        // Click event for address selection popup
        map.current.on('click', layerId, (e) => {
          hoverPopup.current?.remove();
          popup.current?.remove();
          popup.current = new mapboxgl.Popup({ offset: 25, closeOnClick: false })
            .setLngLat(e.lngLat)
            .setDOMContent(createPopupContent(e.features))
            .addTo(map.current);
        });

        // Mouse enter event for hover popup
        // Inside the mouseenter event handler
        map.current.on('mouseenter', layerId, (e) => {
          // Make sure we have features at this point
          if (!e.features || e.features.length === 0) return;

          map.current.getCanvas().style.cursor = 'pointer';

          // Remove existing click popup when hovering
          popup.current?.remove();
          popup.current = null;

          // Remove any existing hover popup
          hoverPopup.current?.remove();

          // Create a new hover popup
          hoverPopup.current = new mapboxgl.Popup({
            offset: 25,
            closeOnClick: false,
            closeButton: false,
            className: 'hover-popup'
          })
            .setLngLat(e.lngLat)
            .addTo(map.current);

          // Get the first feature
          const feature = e.features[0];

          if (feature.properties) {
            // Dynamically load content
            createHoverPopupContent({
              numero: feature.properties.numero,
              nomVoie: feature.properties.nomVoie
            }).then(content => {
              // Only update if popup still exists
              if (hoverPopup.current) {
                hoverPopup.current.setDOMContent(content);
              }
            });
          }
        });

        // Mouse leave event to remove hover popup
        map.current.on('mouseleave', layerId, () => {
          map.current.getCanvas().style.cursor = '';
          // Only remove hover popup if it exists and we don't have a click popup open
          if (hoverPopup.current && !popup.current) {
            hoverPopup.current.remove();
            hoverPopup.current = null;
          }
        });
      });
    });

    return () => {
      map.current?.remove();
      popup.current?.remove();
      hoverPopup.current?.remove();
    };
  }, []);

  const typeNames = [
    "Appartement",
    "Maison",
    "Bien Multiple",
    "commercial",
   
 
   
  ];

  // Icônes pour chaque type, dans le même ordre
  const propertyTypeIcons = [
   
   
    // Local industriel
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
      <rect x="9" y="9" width="6" height="6"></rect>
      <line x1="9" y1="1" x2="9" y2="4"></line>
      <line x1="15" y1="1" x2="15" y2="4"></line>
      <line x1="9" y1="20" x2="9" y2="23"></line>
      <line x1="15" y1="20" x2="15" y2="23"></line>
      <line x1="20" y1="9" x2="23" y2="9"></line>
      <line x1="20" y1="14" x2="23" y2="14"></line>
      <line x1="1" y1="9" x2="4" y2="9"></line>
      <line x1="1" y1="14" x2="4" y2="14"></line>
    </svg>,
    // Appartement
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>,
    // Maison
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>,
     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
     <rect x="3" y="3" width="7" height="7"></rect>
     <rect x="14" y="3" width="7" height="7"></rect>
     <rect x="14" y="14" width="7" height="7"></rect>
     <rect x="3" y="14" width="7" height="7"></rect>
   </svg>
 ];

  // Toggle button for statistics panel
  const toggleStatsPanel = () => {
    setShowStatsPanel(prev => !prev);
  };

  const ApartmentIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9M9 22V12h6v10M3 10l9-7 9 7"/>
    </svg>
  );
  
  const HouseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
  
  const CommercialIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M9 9h6v6H9z"/>
    </svg>
  );
  
  const MultipleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="8" height="8" rx="1"/>
      <rect x="13" y="3" width="8" height="8" rx="1"/>
      <rect x="3" y="13" width="8" height="8" rx="1"/>
      <rect x="13" y="13" width="8" height="8" rx="1"/>
    </svg>
  );


  const getIconForType = (typeBien) => {
    const icons = {
      "Appartement": <ApartmentIcon />,
      "Maison": <HouseIcon />,
      "Local industriel. commercial ou assimilé": <CommercialIcon />,
      "Bien Multiple": <MultipleIcon />
    };
    return icons[typeBien] || <ApartmentIcon />;
  };
  
  const getShortTypeName = (typeBien) => {
    const names = {
      "Appartement": "Appart",
      "Maison": "Maison",
      "Local industriel. commercial ou assimilé": "Local",
      "Bien Multiple": "Multiple"
    };
    return names[typeBien] || typeBien.split(' ')[0];
  };






  useEffect(() => {
    const fetchData = async () => {
      if (!currentCity) return;
      
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/mutations/statistics/${currentCity.toLowerCase()}`
        );
        setPropertyStats(response.data);
      } catch (err) {
        console.error("Erreur:", err);
        setError("Erreur de chargement");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [currentCity]);

const getActiveStats = () => {
  // Ajouter une gestion explicite de "Bien Multiple"
  const typeName = typeNames[activePropertyType]?.replace(/\./g, '').trim();
  
  return propertyStats.find(stat => 
    stat.typeBien.replace(/\./g, '').trim() === typeName
  ) || { nombre: 0, prixMoyen: 0, prixM2Moyen: 0 };
};
  const activeStats = getActiveStats();

  // Formatter les nombres pour l'affichage
  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  return (
    <div className="relative h-screen w-full">
  {showStatsPanel ? (
  <div className="absolute top-4 left-4 z-10 bg-white rounded-xl shadow-xl p-4 w-64 border border-gray-100">
    {/* En-tête */}
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-semibold text-gray-800">📊 Statistiques</h3>
      <div className="text-xs text-gray-500">{currentCity}</div>
      <button 
        onClick={toggleStatsPanel}
        className="p-1 hover:bg-gray-100 rounded-full"
      >
        <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    {/* Onglets des types - avec les icônes conservées */}
    <div className="bg-gray-50 rounded-lg p-1 flex gap-1 mb-4">
      {propertyStats.map((stat, index) => (
        <button
          key={stat.typeBien}
          className={`flex-1 py-1.5 px-1 rounded-md flex flex-col items-center ${
            activePropertyType === index
              ? 'bg-white shadow-md text-blue-600'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
          onClick={() => setActivePropertyType(index)}
        >
          <span className="text-sm">
            {getIconForType(stat.typeBien)}
          </span>
          <span className="text-xs font-medium">
            {getShortTypeName(stat.typeBien)}
          </span>
        </button>
      ))}
    </div>

    {/* Statistiques */}
    {isLoading ? (
      <div className="flex justify-center py-3">
        <div className="animate-spin rounded-full h-6 w-6 border-3 border-blue-500 border-t-transparent"/>
      </div>
    ) : error ? (
      <div className="text-red-500 text-center py-2 text-xs">
        ⚠️ {error}
      </div>
    ) : (
      <div className="space-y-3">
        <div className="bg-blue-50 p-2.5 rounded-lg">
          <p className="text-xs text-blue-600 mb-1 font-medium">Ventes</p>
          <p className="text-base font-bold text-gray-800">
            {formatNumber(propertyStats[activePropertyType]?.nombre)}
          </p>
        </div>
        
        <div className="bg-green-50 p-2.5 rounded-lg">
          <p className="text-xs text-green-600 mb-1 font-medium">Prix Moyen</p>
          <p className="text-base font-bold text-gray-800">
            {formatNumber(propertyStats[activePropertyType]?.prixMoyen)}€
          </p>
        </div>
        
        <div className="bg-purple-50 p-2.5 rounded-lg">
          <p className="text-xs text-purple-600 mb-1 font-medium">Prix/m²</p>
          <p className="text-base font-bold text-gray-800">
            {formatNumber(propertyStats[activePropertyType]?.prixM2Moyen)}€
          </p>
        </div>
      </div>
    )}
  </div>
) : (
  <button
    onClick={() => {
      setActivePropertyType(0);
      toggleStatsPanel();
    }}
    className="absolute top-4 left-4 z-10 bg-white text-gray-600 px-3 py-2 rounded-lg shadow-md flex items-center gap-2 hover:bg-gray-50"
  >
    <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
    </svg>
    <span className="text-xs font-medium">Statistiques</span>
  </button>
)}
      {/* Controls Container */}
      <div className="absolute top-20 right-5  flex flex-col gap-2 z-10">
        {/* Zoom Controls */}
        <div className="bg-white rounded-lg shadow-md flex flex-col">
          <button
            onClick={() => map.current?.zoomIn()}
            className="p-2 hover:bg-gray-100 rounded-t-lg flex items-center justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          <div className="border-t"></div>
          <button
            onClick={() => map.current?.zoomOut()}
            className="p-2 hover:bg-gray-100 rounded-b-lg flex items-center justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14" />
            </svg>
          </button>
        </div>

        {/* Style Switcher */}
        <button
          onClick={() => map.current?.setStyle('mapbox://styles/saber5180/cm9737hvv00en01qzefcd57b7')}
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 flex items-center justify-center"
          title="Changer le style de la carte"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <path d="M7.5 4.21l4.5 2.6M7.5 19.79V14.6L3 12M16.5 4.21V9.4L21 12M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
          </svg>
        </button>
      </div>
      {/* Map Container */}
      <div ref={mapContainer} className="h-full w-full" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center shadow-xl">
            <svg
              className="animate-spin h-5 w-5 mr-3 text-blue-600"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-gray-700">Recherche des propriétés...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map2;