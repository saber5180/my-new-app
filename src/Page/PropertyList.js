import React, { useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import Map from '../components/Map';

const PropertyList = ({ properties }) => {
  const [activeView, setActiveView] = useState('list'); // 'list' or 'map'

  return (
    <div className="flex flex-col lg:flex-row p-4 w-full h-screen overflow-hidden"> 
      {/* Mobile View Switcher */}
      <div className="lg:hidden flex mb-2 bg-gray-100 rounded-full">
        <button 
          className={`flex-1 py-2 rounded-full transition-colors ${activeView === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
          onClick={() => setActiveView('list')}
        >
          Liste
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
            <select className="w-full lg:w-auto appearance-none bg-white border border-gray-300 rounded-md px-2 py-1 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Les plus récentes</option>
              <option>Prix croissant</option>
              <option>Prix décroissant</option>
              <option>Surface</option>
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
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
      
      {/* Right Section (Map) */}
      <div className={`w-full lg:w-2/3 h-full lg:pt-12 lg:px-4 ${activeView === 'list' && 'hidden lg:block'}`}>
        <Map />
      </div>
    </div>
  );
};

export default PropertyList;