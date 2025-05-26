import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Map2 from '../components/ComponedNonLiee/Map2';
import PropertyCard from '../components/PropertyCard';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import PropertyCardClick from '../components/PropertyCardClick';

const sidebarVariants = {
  hidden: { x: -300, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  exit: {
    x: -300,
    opacity: 0,
    transition: { ease: "easeInOut", duration: 0.3 }
  }
};

const propertyCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 }
  }),
};

const PropertyList = ({ searchParams }) => {
  const [properties, setProperties] = useState([]);
  const [currentCity, setCurrentCity] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [activeView, setActiveView] = useState('map');
  const [currentAddress, setCurrentAddress] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [mapCoordinates, setMapCoordinates] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const closeSidebar = () => {
    setSelectedProperty(null);
    if (window.innerWidth < 1024) setActiveView('map');
  };

  const normalizeFrenchCharacters = (str) => {
    return typeof str === 'string'
      ? str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/œ/g, 'oe')
        .replace(/æ/g, 'ae')
        .replace(/ç/g, 'c')
        .replace(/[^a-zA-Z0-9]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toUpperCase()
      : '';
  };

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
    if (window.innerWidth < 1024) setActiveView('list');
  };

  const handlePropertiesFound = (newProperties) => {
    setProperties(newProperties);
    setSimilarProperties(newProperties.slice(0, 5));
    setCurrentAddress(null);
    if (newProperties.length > 0 && window.innerWidth < 1024) {
      setActiveView('list');
    }
  };

  const handleAddressFound = (addressInfo) => {
    const normalizedAddress = {
      address: normalizeFrenchCharacters(addressInfo.address),
      city: normalizeFrenchCharacters(addressInfo.city)
    };
    setCurrentAddress(normalizedAddress);
    setProperties([]);
    setSelectedProperty(null);
    if (window.innerWidth < 1024) {
      setActiveView('list');
    }
  };

  const streetTypePrefixes = [
    'COURS', 'BOULEVARD', 'AVENUE', 'RUE', 'PLACE', 'PASSAGE',
    'IMPASSE', 'ALLEE', 'CHEMIN', 'ROUTE', 'SQUARE', 'GALERIE',
    'RESIDENCE', 'QUAI', 'QUARTIER'
  ];

  const removeStreetType = (streetName) => {
    const prefixRegex = new RegExp(`^(${streetTypePrefixes.join('|')})\\s+`, 'i');
    return streetName.replace(prefixRegex, '');
  };

  const handleMapMove = React.useCallback(async (coordinates) => {
    setMapCoordinates(coordinates);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?types=address&language=fr&access_token=${mapboxgl.accessToken}`
      );

      const data = await response.json();
      let streetName = '';
      let communeName = '';

      const addressFeature = data.features.find(f => f.place_type.includes('address'));
      if (addressFeature) {
        const rawStreet = addressFeature.text.replace(/^\d+[\s,]*/, '').trim();
        streetName = removeStreetType(normalizeFrenchCharacters(rawStreet)).trim();
        const communeContext = addressFeature.context?.find(c => c.id.startsWith('place.'));
        communeName = communeContext?.text ? normalizeFrenchCharacters(communeContext.text) : '';
      }

      setCurrentCity(communeName && streetName ? `${communeName}, ${streetName}` : communeName || streetName);

      if (communeName && streetName) {
        const response = await axios.get('https://immoxperts.apeiron-tech.dev/api/mutations/mutations/by-street-and-commune', {
          params: {
            street: streetName,  // Full normalized street name
            commune: communeName // Normalized commune name
          }

        const formatted = response.data.map(mutation => ({
          id: mutation.idmutation,
          address: mutation.addresses?.[0] || 'Adresse inconnue',
          city: communeName,
          price: `${mutation.valeurfonc?.toLocaleString('fr-FR')} €`,
          surface: `${mutation.surface?.toLocaleString('fr-FR')} m²`,
          type: mutation.libtyploc,
          soldDate: new Date(mutation.datemut).toLocaleDateString('fr-FR'),
          pricePerSqm: mutation.valeurfonc && mutation.surface
            ? `${Math.round(mutation.valeurfonc / mutation.surface).toLocaleString('fr-FR')} €/m²` : 'N/A'
        }));

        setProperties(formatted);
      }
    } catch (error) {
      console.error('Error handling map movement:', error);
      setProperties([]);
    }
  }, []);

  return (
    <div className="flex flex-col lg:flex-row w-full pb-1 h-full overflow-hidden">
      {/* Mobile Toggle View */}
      <div className="lg:hidden flex justify-center gap-2 py-2 bg-white shadow z-10">
        <button
          onClick={() => setActiveView('map')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${activeView === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Carte
        </button>
        <button
          onClick={() => setActiveView('list')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${activeView === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Liste
        </button>
      </div>

      {/* Sidebar (List or Property) */}
      <div className={`w-full lg:w-1/3 flex flex-col h-full ${activeView === 'map' && 'hidden lg:flex'}`}>
        <AnimatePresence mode='wait'>
          {selectedProperty ? (
            <motion.div
              className="h-full w-full bg-white overflow-hidden border-r border-gray-200 rounded-lg"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              key="property-details"
            >
              <div className="w-full h-full overflow-y-auto custom-scroll">
                <div className="p-4 space-y-4">
                  <div className="pt-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 p-2 w-full">
                        <motion.div
                          key={currentIndex}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <PropertyCardClick
                            property={similarProperties[currentIndex]}
                            onClick={() => handlePropertySelect(similarProperties[currentIndex])}
                            compact
                          />
                        </motion.div>

                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setCurrentIndex(prev => prev > 0 ? prev - 1 : similarProperties.length - 1)} className="p-1 hover:text-blue-600">
                            &lt;
                          </button>
                          <span className="text-s px-4 text-blue-600 font-medium">
                            {currentIndex + 1} / {similarProperties.length}
                          </span>
                          <button onClick={() => setCurrentIndex(prev => prev < similarProperties.length - 1 ? prev + 1 : 0)} className="p-1 hover:text-blue-600">
                            &gt;
                          </button>
                        </div>

                        <div className="relative flex items-center py-2">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                          </div>
                          <span className="relative bg-white pr-4 text-gray-900 font-semibold text-sm">
                            En savoir plus
                          </span>
                        </div>

                        <div className="flex flex-col gap-2 text-sm">
                          <p>Générez une analyse à cette adresse pour obtenir :</p>
                          <ul className="list-inside list-disc">
                            <li>L'estimation de la valeur du bien</li>
                            <li>L'analyse cadastrale</li>
                            <li>Une présentation des ventes réalisées à proximité</li>
                            <li>L'évolution des prix dans ce quartier</li>
                            <li>Une analyse du quartier</li>
                          </ul>
                        </div>
                      </div>
                      <button onClick={closeSidebar} className="text-gray-400 hover:text-gray-700 text-3xl">
                        &times;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : currentAddress ? (
            <motion.div
              className="h-full w-full bg-white overflow-hidden border-r border-gray-200 rounded-lg p-4 space-y-4"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              key="default-content"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-lg font-semibold text-gray-800">
                    {currentAddress?.address}
                  </h1>
                  <p className="text-xs text-gray-500">{currentAddress?.city}</p>
                </div>
                <button onClick={() => setCurrentAddress(null)} className="text-gray-500 hover:text-gray-700 text-lg">
                  &times;
                </button>
              </div>

              <div className="bg-blue-50 p-2 rounded-md text-sm">
                <p className="text-gray-600">Aucune transaction récente</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Détails supplémentaires</h3>
                <ul className="list-disc pl-4 space-y-1 text-xs text-gray-600">
                  <li>Tendances de marché</li>
                  <li>Analyse cadastrale</li>
                  <li>Services proximité</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-2 rounded-md text-sm">
                <p className="text-gray-600 mb-1">Estimation gratuite</p>
                <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-700">
                  Évaluer mon bien
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="h-full w-full bg-white overflow-hidden border-r border-gray-200 rounded-lg p-4"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              key="property-cards"
            >
              <h2 className="text-sm font-semibold mb-3">Transactions récentes</h2>
              <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)] pr-1 custom-scroll">
                {properties.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onClick={() => setSelectedProperty(property)}
                    compact
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Map Section */}
      <div className={`lg:w-3/4 w-full h-full relative ${activeView === 'list' ? 'hidden lg:block' : 'block'} flex`}>
        <div className="h-full w-full overflow-hidden">
          <Map2
            onMapMove={handleMapMove}
            onPropertiesFound={handlePropertiesFound}
            onPropertySelect={handlePropertySelect}
            onAddressFound={handleAddressFound}
            searchParams={searchParams}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyList;
