import React, { useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import Map from '../components/Map';
import Map2 from '../components/ComponedNonLiee/Map2';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [activeView, setActiveView] = useState('map'); // 'list' or 'map'
  const [loading, setLoading] = useState(false);

  // Handle properties found from map clicks
  const handlePropertiesFound = (newProperties) => {
    setProperties(newProperties);
    // Switch to list view on mobile if properties were found
    if (newProperties.length > 0 && window.innerWidth < 1024) {
      setActiveView('list');
    }
  };
  
  const handleDataClick = (data) => {
    console.log('Données du point cliqué:', data);
    // Traitez les données ici
  };

  const sortProperties = (sortType) => {
    const sortedProperties = [...properties];
    switch (sortType) {
      case 'recent':
        sortedProperties.sort((a, b) => {
          // Parse dates for proper comparison
          const dateA = a.soldDate ? new Date(a.soldDate.split('/').reverse().join('-')) : new Date(0);
          const dateB = b.soldDate ? new Date(b.soldDate.split('/').reverse().join('-')) : new Date(0);
          return dateB - dateA;
        });
        break;
      case 'priceAsc':
        sortedProperties.sort((a, b) => a.numericPrice - b.numericPrice);
        break;
      case 'priceDesc':
        sortedProperties.sort((a, b) => b.numericPrice - a.numericPrice);
        break;
      case 'surface':
        sortedProperties.sort((a, b) => b.numericSurface - a.numericSurface);
        break;
      default:
        break;
    }
    setProperties(sortedProperties);
  };

  return (
    <div className="flex flex-col lg:flex-row p-4 w-full h-screen overflow-hidden"> 
      {/* Mobile View Switcher */}
      <div className="lg:hidden flex mb-2 bg-gray-100 rounded-full">
        <button 
          className={`flex-1 py-2 rounded-full transition-colors ${activeView === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
          onClick={() => setActiveView('list')}
        >
          Liste {properties.length > 0 && `(${properties.length})`}
        </button>
        <button 
          className={`flex-1 py-2 rounded-full transition-colors ${activeView === 'map' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
          onClick={() => setActiveView('map')}
        >
          Carte
        </button>
      </div>

      {/* Left Section (Property List) */}
      <div className={`w-full lg:w-1/3 flex flex-col h-full ${activeView === 'map' && 'hidden lg:flex'}`}> 
        {/* Sort dropdown - responsive positioning */}
        <div className="flex items-center p-2 bg-white shadow-sm">
          <span className="text-gray-600 mr-2 hidden lg:inline text-sm">Trier par</span>
          <div className="relative w-full lg:w-auto">
            <select 
              className="w-full lg:w-auto appearance-none bg-white border border-gray-300 rounded-md px-2 py-1 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) => sortProperties(e.target.value)}
              disabled={properties.length === 0}
            >
              <option value="recent">Les plus récentes</option>
              <option value="priceAsc">Prix croissant</option>
              <option value="priceDesc">Prix décroissant</option>
              <option value="surface">Surface</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
              <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Scrollable property cards container */}
        <div className="overflow-y-auto flex-1 px-2 space-y-2 pb-2">
  {properties.length > 0 ? (
    properties.map(property => (
      <PropertyCard key={property.id} property={property} />
    ))
  ) : (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
      <p className="text-lg font-medium text-center">
        Aucune vente identifiée à cette adresse
      </p>
    </div>
  )}
</div>
      </div>
      
      {/* Right Section (Map) */}
      <div className={`w-full lg:w-2/3 h-full ${activeView === 'list' ? 'hidden lg:block' : 'block'}`}>
        <div className="h-full border rounded-lg overflow-hidden">
         
         
        <div>
        <Map2 onPropertiesFound={handlePropertiesFound} />
    </div>
    {/*
          <Map onPropertiesFound={handlePropertiesFound} />
    */}
          </div>
      </div>
    </div>
  );
};

export default PropertyList;