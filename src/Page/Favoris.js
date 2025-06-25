import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import { toggleFavorite, clearFavorites } from '../features/favoritesSlice';
import { fetchProperties } from '../features/propertySearchSlice';
import { fetchBuyProperties } from '../features/propertyBuySlice';

const Favoris = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { favorites } = useSelector(state => state.favorites);
  const { properties: rentProperties } = useSelector(state => state.propertySearch);
  const { properties: buyProperties } = useSelector(state => state.propertyBuy);
  const [allFavoriteProperties, setAllFavoriteProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      
      try {
        // Fetch all properties if not already loaded
        if (rentProperties.length === 0) {
          await dispatch(fetchProperties({}));
        }
        if (buyProperties.length === 0) {
          await dispatch(fetchBuyProperties({}));
        }
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [dispatch]);

  useEffect(() => {
    // Combine and filter favorite properties, removing duplicates
    const allProperties = [...rentProperties, ...buyProperties];
    const uniqueProperties = allProperties.filter((property, index, self) => 
      index === self.findIndex(p => p.id === property.id)
    );
    
    const favoriteProperties = uniqueProperties.filter(property => 
      favorites.includes(property.id)
    );
    
    setAllFavoriteProperties(favoriteProperties);
  }, [favorites, rentProperties, buyProperties]);

  const handleRemoveFavorite = (propertyId) => {
    dispatch(toggleFavorite(propertyId));
  };

  const handleClearAllFavorites = () => {
    dispatch(clearFavorites());
  };

  const renderTags = (tags) => {
    if (!tags || !Array.isArray(tags)) return null;
    
    const tagColorMap = {
      'En vente': 'bg-gradient-to-r from-green-400 to-green-600',
      'Géolocalisé': 'bg-gradient-to-r from-orange-400 to-yellow-400',
      'SeLoger': 'bg-gradient-to-r from-indigo-400 to-indigo-600',
      'Baisse de prix': 'bg-gradient-to-r from-green-400 to-green-600',
      'leboncoin': 'bg-gradient-to-r from-indigo-400 to-blue-400',
      'Expiré': 'bg-gradient-to-r from-red-400 to-red-600',
      'default': 'bg-gradient-to-r from-gray-400 to-gray-600'
    };

    return tags.map((tag, index) => (
      <span
        key={index}
        className={`${tagColorMap[tag] || tagColorMap['default']} text-white text-xs px-2 py-1 rounded-lg mr-1 shadow-sm`}
      >
        {tag}
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de vos favoris...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </motion.button>
              <div className="flex items-center space-x-3">
                <ShoppingCart className="h-8 w-8 text-indigo-600" />
                <div>
                  <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">Mes Favoris</h1>
                  <p className="text-gray-600">{allFavoriteProperties.length} propriété{allFavoriteProperties.length !== 1 ? 's' : ''} sauvegardée{allFavoriteProperties.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
            
            {allFavoriteProperties.length > 0 && (
              <motion.button
                onClick={handleClearAllFavorites}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-colors shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 className="h-4 w-4" />
                <span>Vider la liste</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {allFavoriteProperties.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucun favori</h2>
            <p className="text-gray-600 mb-6">Vous n'avez pas encore ajouté de propriétés à vos favoris.</p>
            <div className="space-x-4">
              <motion.button
                onClick={() => navigate('/louer')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Chercher à louer
              </motion.button>
              <motion.button
                onClick={() => navigate('/acheter')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-colors shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Chercher à acheter
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {allFavoriteProperties.map((property, index) => (
              <motion.div 
                key={`${property.id}-${index}`} 
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(80, 0, 200, 0.10)' }}
              >
                {/* Property Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={property.images && property.images.length > 1 ? property.images[1] : (property.images && property.images[0])} 
                    alt={property.address || 'Property'}
                    className="w-full h-full object-cover rounded-2xl"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+non+disponible';
                    }}
                  />
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {renderTags(property.tags)}
                  </div>
                  <motion.button 
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow"
                    onClick={() => handleRemoveFavorite(property.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                  </motion.button>
                </div>

                {/* Property Details */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                      {property.priceText || `${property.price || 'N/A'} €`}
                    </h3>
                  </div>
                  
                  <p className="text-gray-700 font-medium mb-1">
                    {property.propertyType || 'Type non spécifié'}
                  </p>
                  
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {property.address || 'Adresse non disponible'}
                  </p>
                  
                  <p className="text-gray-500 text-sm mb-3">
                    {property.details || 'Détails non disponibles'}
                  </p>

                  {/* Agency Logo */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {property.Association && Array.isArray(property.Association) && property.Association.map((association, idx) => (
                        <img
                          key={idx}
                          src={`/src/assets/${association}.png`}
                          alt={association}
                          className="h-4 w-4"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ))}
                    </div>
                    {property.images && property.images.length > 0 && (
                      <img 
                        src={property.images[0]} 
                        alt="Agency Logo" 
                        className="w-10 h-6 rounded object-cover border border-gray-200"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Favoris; 