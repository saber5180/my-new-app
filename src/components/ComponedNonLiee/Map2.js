import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './mapbox-popup.css';
import axios from 'axios';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FiZXI1MTgwIiwiYSI6ImNtOGhqcWs4cTAybnEycXNiaHl6eWgwcjAifQ.8C8bv3cwz9skLXv-y6U3FA';

const Map2 = ({
  onMapMove,
  onPropertySelect,
  onPropertiesFound,  // Add this
  onAddressFound,     // Add this
  searchParams
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const popup = useRef(null);
  const hoverPopup = useRef(null);
  const [loading, setLoading] = useState(false);
  const [activeLayers, setActiveLayers] = useState([]);
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [currentCity, setCurrentCity] = useState('Ajaccio');
  const { numero, nomVoie, coordinates } = searchParams;
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);

  const [propertyStats, setPropertyStats] = useState([]);
  const [activePropertyType, setActivePropertyType] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const hoveredId = useRef(null);
  const selectedId = useRef(null);


  const TILESET_ID = 'saber5180.3oxcv6ps';
  const SOURCE_LAYER = 'partaaaaaaaaaaaaaaaaaa1-5qm32j';
  const LAYER_ID = 'parcels-interactive-layer';




  const typeNames = [
    "Appartement",
    "Maison",
    "Local",
    "Terrain",
    "Bien Multiple"
  ];

  const getShortTypeName = (typeBien) => {
    const names = {
      "Appartement": "Appartement",
      "Maison": "Maison",
      "Local industriel. commercial ou assimilé": "Local",
      "Terrain": "Terrain",
      "Bien Multiple": "Bien Multiple",

    };
    return names[typeBien] || typeBien.split(' ')[0];
  };






  useEffect(() => {
    const panelRef = document.querySelector('.sidebar-panel');
    const handleOutsideClick = (e) => {
      if (showStatsPanel && panelRef && !panelRef.contains(e.target)) {
        setShowStatsPanel(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [showStatsPanel]);









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
  useEffect(() => {
    if (coordinates && map.current) {
      map.current.flyTo({
        center: coordinates,
        zoom: 17,
      });
    }
  }, [coordinates]);

  useEffect(() => {
    if (numero && nomVoie) {
      handleAddressClick({ numero, nomVoie });
    }
  }, [numero, nomVoie]);


  useEffect(() => {
    if (!map.current) return;

    const fetchMutations = async (street, commune) => {
      try {
        const response = await axios.get(
          'https://immoxperts.apeiron-tech.dev/api/mutations/mutations/by-street-and-commune',
          {
            params: {
              street: encodeURIComponent(street),
              commune: encodeURIComponent(commune)
            }
          }
        );

        const formatted = response.data.map(mutation => ({
          id: mutation.idmutation,
          address: mutation.addresses?.[0] || 'Adresse inconnue',
          city: commune,
          price: `${mutation.valeurfonc?.toLocaleString('fr-FR')} €`,
          surface: `${mutation.surface?.toLocaleString('fr-FR')} m²`,
          type: mutation.libtyploc,
          soldDate: new Date(mutation.datemut).toLocaleDateString('fr-FR'),
          pricePerSqm: mutation.valeurfonc && mutation.surface ?
            `${Math.round(mutation.valeurfonc / mutation.surface).toLocaleString('fr-FR')} €/m²` : 'N/A'
        }));

        onPropertiesFound(formatted);
      } catch (error) {
        console.error('Error fetching mutations:', error);
        onPropertiesFound([]);
      }
    };



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


    map.current.on('moveend', updateLocationName);
    map.current.on('zoomend', updateLocationName);

    return () => {
      if (map.current) {
        map.current.off('moveend', updateLocationName);
        map.current.off('zoomend', updateLocationName);
      }
    };
  }, [map.current]);

  const fetchAddressData = async (properties) => {
    try {

      const numero = normalizeSearchParams(properties.numero?.toString());
      const nomVoie = normalizeSearchParams(properties.nomVoie);

      if (!numero || !nomVoie) {
        throw new Error('Données d\'adresse incomplètes');
      }


      const params = new URLSearchParams({
        novoie: numero.replace(/\D/g, ''),
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

        const addressParts = rawAddress.split(' ');
        const streetNumber = addressParts.find(part => /^\d+/.test(part)) || '';
        const streetNameParts = addressParts.filter(part => part !== streetNumber && !/^\d{5}/.test(part));
        const cityParts = addressParts.slice(-2);

        return {
          id: mutation.idmutation || Date.now(),
          address: `${streetNumber} ${streetNameParts.join(' ')}`,
          city: cityParts.join(' '),
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

  const handleAddressClick = async (properties) => { // properties contains the address data
    try {
      setLoading(true);
      const formattedProperties = await fetchAddressData(properties);

      if (formattedProperties.length > 0) {
        onPropertySelect?.(formattedProperties[0]);
        onPropertiesFound?.(formattedProperties);
      } else {
        // Use the properties parameter that was passed to the function
        onAddressFound({
          address: `${properties.numero} ${properties.nomVoie}`,
          city: currentCity // Use the existing city state
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert(`Échec de la recherche : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  function formatFrenchDate(dateStr) {
    const months = {
      janvier: '01',
      février: '02',
      mars: '03',
      avril: '04',
      mai: '05',
      juin: '06',
      juillet: '07',
      août: '08',
      septembre: '09',
      octobre: '10',
      novembre: '11',
      décembre: '12'
    };

    const [day, monthName, year] = dateStr.split(' ');
    const dayFormatted = day.padStart(2, '0');
    const month = months[monthName.toLowerCase()] || '01';

    return `${dayFormatted}/${month}/${year}`;
  }

  const createHoverPopupContent = async (properties) => {
    const container = document.createElement('div');
    container.className = 'popup-container';

    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'flex items-center justify-center';
    loadingIndicator.innerHTML = `
    `;
    container.appendChild(loadingIndicator);


    const formattedProperties = await fetchAddressData(properties);
    const getPropertyTypeColor = (type) => {
      const colorMap = {
        "appartement": "#4F46E5",
        "local industriel commercial ou assimile": "#8B5CF6",
        "terrain": "#60A5FA",
        "bien multiple": "#2563EB",
        "maison": "#1E3A8A"
      };
      return colorMap[type.toLowerCase().trim()] || "#9CA3AF";
    };

    if (formattedProperties.length > 0) {
      container.innerHTML = '';

      const property = formattedProperties[0];

      const propertyTypeLabel = property.type
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      const cityName = property.city.split(' ')[1] || '';

      const priceFormatted = property.numericPrice.toLocaleString('fr-FR') + ' €';
      const pricePerSqm = Math.round(property.numericPrice / property.numericSurface).toLocaleString('fr-FR') + ' €/m²';
      container.innerHTML = `
      <div style="
        background: #fff;
        padding: 1px;
        font-family: 'Maven Pro', sans-serif;
        max-width: 480px;
        width: 100%;
        position: relative;
        border-radius: 16px;
      ">
        <!-- Address -->
        <div style="font-weight: 700; font-size: 16px;width:75%; margin-bottom: 10px; color: #1a1a1a;">
          ${property.address.toUpperCase()} – ${cityName}
        </div>
    
        <!-- Property Type, Rooms, Surface -->
        <div style="font-size: 16px;width:70%; color: #333;">
          <span style="color: ${getPropertyTypeColor(propertyTypeLabel)}; font-weight: 900; margin-bottom: 10px;">
            ${propertyTypeLabel}
          </span><br/>
          <span style="margin-top: 10px;">${property.rooms} pièces – ${property.surface}</span>
        </div>
    
        <!-- Price Box -->
        <div style="
          position: absolute;
          top: 0px;
          right: 0px;
          border: 1px solid #e5e7eb;
          padding: 10px 14px;
          border-radius: 12px;
          text-align: right;
          min-width: 110px;
        ">
          <div style="color: #241c83; font-weight: 800; font-size: 18px;">${priceFormatted}</div>
          <div style="color: #888; font-size: 14px;">${pricePerSqm}</div>
        </div>
    
        <!-- Sold Date -->
        <div style="
          margin-top: 16px;
          display: inline-block;
          border: 1px solid #e5e7eb;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 14px;
          color: #444;
        ">
          Vendu le <strong style="color: #000;">${formatFrenchDate(property.soldDate)}</strong>
        </div>
      </div>
    `;




      container.querySelector('.popup-button')?.addEventListener('click', (e) => {
        e.stopPropagation();
        handleAddressClick(properties);
        hoverPopup.current?.remove();
      });

    } else {
      const addressLine = properties?.address || '';
      console.log('Raw address:', addressLine);

      let street = '';
      let cityName = '';

      if (addressLine.includes(' - ')) {
        const [rawStreet, rawCity] = addressLine.split(' - ');
        street = rawStreet || '';
        cityName = rawCity?.split(' ')[1] || '';
      } else {
        console.warn('Unexpected address format:', addressLine);
      }

      container.innerHTML = `
        <div style="
            background: #fff;
            padding: 4px;
            font-family: 'Maven Pro', sans-serif;
            max-width: 480px;
            width: 100%;
            position: relative;
            border-radius: 16px;
        ">
            <!-- Address -->
            <div style="font-weight: 700; font-size: 16px;width:75%; margin-bottom: 10px; color: #1a1a1a;">
            ${properties.numero}  ${properties.nomVoie}
            </div>
    
            <!-- No sales message -->
            <div style="font-size: 14px; color: #333; margin-top: 8px;">
                Aucune vente identifiée à cette adresse
            </div>
        </div>`;
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



    map.current.on('moveend', () => {
      const center = map.current.getCenter();
      if (typeof onMapMove === 'function') {
        onMapMove([center.lng, center.lat]);
      }
    });


    map.current.addControl(new mapboxgl.ScaleControl({
      unit: 'metric'
    }), 'top-right');

    map.current.on('load', () => {

      map.current.addSource('parcels-source', {
        type: 'vector',
        url: `mapbox://${TILESET_ID}`
      });


      map.current.addLayer({
        id: LAYER_ID,
        type: 'fill',
        source: 'parcels-source',
        'source-layer': SOURCE_LAYER,
        paint: {
          'fill-color': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            '#2196F3',
            ['boolean', ['feature-state', 'hover'], false],
            '#CCCCCC',
            '#FFFFFF'
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
    map.current.on('load', () => {

      const layers = map.current.getStyle().layers;
      const visibleLayers = layers.filter(layer =>
        layer.type === 'circle' &&
        layer.layout?.visibility !== 'none'
      );

      setActiveLayers(visibleLayers.map(l => l.id));

      visibleLayers.forEach(({ id: layerId }) => {

        map.current.on('click', layerId, (e) => {
          hoverPopup.current?.remove();
          popup.current?.remove();
          popup.current = new mapboxgl.Popup({ offset: 25, closeOnClick: false })
            .setLngLat(e.lngLat)
            .setDOMContent(createPopupContent(e.features))
            .addTo(map.current);
        });


        map.current.on('mouseenter', layerId, (e) => {

          if (!e.features || e.features.length === 0) return;

          map.current.getCanvas().style.cursor = 'pointer';


          popup.current?.remove();
          popup.current = null;


          hoverPopup.current?.remove();


          hoverPopup.current = new mapboxgl.Popup({
            offset: 12,
            closeOnClick: false,
            closeButton: false,
            className: 'hover-popup'
          })
            .setLngLat(e.lngLat)
            .addTo(map.current);


          const feature = e.features[0];

          if (feature.properties) {

            createHoverPopupContent({
              numero: feature.properties.numero,
              nomVoie: feature.properties.nomVoie
            }).then(content => {

              if (hoverPopup.current) {
                hoverPopup.current.setDOMContent(content);
              }
            });
          }
        });


        map.current.on('mouseleave', layerId, () => {
          map.current.getCanvas().style.cursor = '';

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

  useEffect(() => {
    if (coordinates && map.current) {
      map.current.flyTo({
        center: coordinates,
        zoom: 17,
      });
    }
  }, [coordinates]);

  const propertyTypeIcons = [



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








  useEffect(() => {
    const fetchData = async () => {
      if (!currentCity) return;

      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://immoxperts.apeiron-tech.dev/api/mutations/statistics/${currentCity.toLowerCase()}`
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









  // 📌 Regrouper les stats par nom court
  const statsByShortType = {};
  propertyStats.forEach((stat) => {
    const shortName = getShortTypeName(stat.typeBien);
    statsByShortType[shortName] = stat;
  });

  return (
    <div className="relative h-screen w-full">
      <button
        onClick={() => {
          if (!showStatsPanel) {
            setActivePropertyType(0);
          }
          toggleStatsPanel();
        }}
        className="absolute top-4 left-6 z-20 bg-white text-gray-600 px-2 py-1 rounded-lg flex items-center gap-1 text-xs hover:bg-gray-50"
      >
        {showStatsPanel ? (
          <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Stats Panel */}
      {showStatsPanel && (
        <div className="absolute top-4 left-16 z-10 bg-white rounded-xl shadow-lg p-4 w-[448px] border border-gray-100" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-800">Statistiques Marché</h3>
            <div className="text-sm font-medium text-gray-600">{currentCity}</div>
          </div>

          <div className="h-px bg-gray-200 w-full mb-3" />

          {(() => {
            const typeNames = ["Appartement", "Maison", "Local", "Terrain", "Bien Multiple"];

            const getIndigoShade = (idx) => [
              "bg-indigo-600",
              "bg-violet-500",
              "bg-blue-400",
              "bg-blue-600",
              "bg-blue-900"
            ][idx];

            const normalizedStats = typeNames.map(shortName => {
              const match = propertyStats.find(item =>
                getShortTypeName(item.typeBien) === shortName
              );
              return {
                typeBien: shortName,
                nombre: match?.nombre || 0,
                prixMoyen: match?.prixMoyen || 0,
                prixM2Moyen: match?.prixM2Moyen || 0
              };
            });

            return (
              <>
                {/* Onglets */}
                <div className="flex mb-3 gap-1">
                  {normalizedStats.map((stat, index) => (
                    <button
                      key={stat.typeBien}
                      className={`flex-1 py-2 px-2 rounded-lg text-center text-xs font-medium ${activePropertyType === index
                          ? `${getIndigoShade(index)} text-white`
                          : "text-gray-600 hover:bg-gray-100 bg-gray-50"
                        }`}
                      onClick={() => setActivePropertyType(index)}
                    >
                      {stat.typeBien}
                    </button>
                  ))}
                </div>

                {/* Stats */}
                {isLoading ? (
                  <div className="flex justify-center py-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-500 border-t-transparent" />
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center py-1 text-xs">⚠️ {error}</div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Ventes</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatNumber(normalizedStats[activePropertyType]?.nombre)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Prix Médian</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatNumber(normalizedStats[activePropertyType]?.prixMoyen)}€
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">€/m²</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatNumber(normalizedStats[activePropertyType]?.prixM2Moyen)}
                      </p>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* Controls */}
      <div className="absolute top-20 right-5 flex flex-col gap-2 z-10">
        <div className="bg-white rounded-lg shadow-md flex flex-col">
          <button onClick={() => map.current?.zoomIn()} className="p-2 hover:bg-gray-100 rounded-t-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          <div className="border-t"></div>
          <button onClick={() => map.current?.zoomOut()} className="p-2 hover:bg-gray-100 rounded-b-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14" />
            </svg>
          </button>
        </div>

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

      <div ref={mapContainer} className="h-full w-full" />

      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center shadow-xl">
            <svg className="animate-spin h-5 w-5 mr-3 text-blue-600" viewBox="0 0 24 24">
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

