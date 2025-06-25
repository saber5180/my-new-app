import React, { useEffect, useState } from 'react';
import { Home, Search, Heart, User, ChevronLeft, ChevronDown, ChevronRight, ShoppingCart, ChevronFirst, ChevronLast } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import leboncoin from '../../assets/leboncoin-e1561735918709.png';
import avendrealouer from '../../assets/figaroimmo.webp';
import figaroimmo from '../../assets/353-3535371_seloger-pv-logicimmo-avendrealouer-leboncoin-bienici-bien-ici-removebg-preview.png';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBuyProperties } from '../../features/propertyBuySlice';
import { toggleFavorite } from '../../features/favoritesSlice';
import { useNavigate } from 'react-router-dom';

const RecherchAcheter = () => {
  const associationLogos = {
    'leboncoin': leboncoin,
    'avendrealouer': avendrealouer,
    'figaroimmo': figaroimmo,
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const dispatch = useDispatch();
  const { searchParams, properties, loading, error } = useSelector(state => state.propertyBuy);
  const { favorites } = useSelector(state => state.favorites);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchBuyProperties(searchParams));
  }, [dispatch, searchParams]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchParams]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleToggleFavorite = (propertyId) => {
    dispatch(toggleFavorite(propertyId));
  };

  // Pagination logic
  const totalPages = Math.ceil(properties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = properties.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Function to render tags
  const renderTags = (tags) => {
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
      <motion.span
        key={index}
        className={`${tagColorMap[tag] || tagColorMap['default']} text-white text-xs px-2 py-1 rounded-lg mr-1 shadow-sm`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ scale: 1.05 }}
      >
        {tag}
      </motion.span>
    ));
  };

  const ImageGallery = ({ images, tags, propertyId }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const { favorites } = useSelector(state => state.favorites);

    // Filter out the first image (agency logo) from the carousel
    const carouselImages = images && images.length > 1 ? images.slice(1) : [];

    const handleDotClick = (index) => {
      setCurrentImageIndex(index);
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    // Auto-cycle images when hovering
    React.useEffect(() => {
      let intervalId;
      if (isHovering && carouselImages.length > 1) {
        intervalId = setInterval(() => {
          setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
        }, 1500); // Change image every 1.5 seconds
      }

      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }, [isHovering, carouselImages.length]);

    const isFavorite = favorites.includes(propertyId);

    return (
      <motion.div
        className="relative h-56 md:h-60 overflow-hidden rounded-2xl group shadow-lg bg-white/70 backdrop-blur-md"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={currentImageIndex}
            src={carouselImages[currentImageIndex] || (images && images[0])}
            alt={`Property image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover rounded-2xl absolute"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute top-2 left-2 flex pb-1 flex-wrap gap-1 z-10">
            {renderTags(tags)}
          </div>
          <motion.button 
            className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white z-10 shadow"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleToggleFavorite(propertyId)}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-500 hover:text-red-500'}`} />
          </motion.button>

          {/* Image Indicator Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {carouselImages.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full ${index === currentImageIndex
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                  : 'bg-white/50 hover:bg-white/75'
                }`}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 pb-20">
      {/* Header */}
      <header className="mt-10 rounded-2xl">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center pt-4">
            {/* Desktop Menu */}
            <motion.div 
              className="hidden sm:flex space-x-4 rounded-xl border py-2 pr-60 px-4 bg-white shadow-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.button 
                className="px-5 py-3 rounded-xl text-sm font-medium text-gray-900 bg-gray-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Paris (75)
              </motion.button>
              <motion.button 
                className="px-3 py-2 rounded-xl text-sm font-medium text-gray-900 bg-gray-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Biens publiés (Annonces)
              </motion.button>
              <motion.button 
                className="px-3 py-2 rounded-xl text-sm font-medium text-gray-900 bg-gray-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Professionnel
              </motion.button>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <div className="sm:hidden flex items-center w-full justify-between">
              <motion.button
                onClick={toggleMobileMenu}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                whileTap={{ scale: 0.9 }}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.button>

              <div className="flex items-center space-x-4">
                <motion.button 
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                  whileTap={{ scale: 0.95 }}
                >
                  Date de la vente
                  <ChevronDown className="ml-1 h-4 w-4" />
                </motion.button>
                <motion.button 
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                  whileTap={{ scale: 0.95 }}
                >
                  Exporter
                </motion.button>
              </div>
            </div>

            {/* Desktop Right Side Menu */}
            <motion.div 
              className="hidden sm:flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.button 
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Date de la vente
                <ChevronDown className="ml-1 h-4 w-4" />
              </motion.button>
              <motion.button 
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.87915 0.00012207C10.2934 0.00012207 10.6292 0.335909 10.6292 0.750122V12.7911C10.6292 13.2053 10.2934 13.5411 9.87915 13.5411C9.46494 13.5411 9.12915 13.2053 9.12915 12.7911V0.750122C9.12915 0.335909 9.46494 0.00012207 9.87915 0.00012207Z" fill="black" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M6.43389 9.3329C6.72739 9.04061 7.20226 9.04158 7.49455 9.33508L9.87913 11.7295L12.2637 9.33508C12.556 9.04158 13.0309 9.04061 13.3244 9.3329C13.6179 9.62519 13.6188 10.1001 13.3266 10.3936L10.4106 13.3216C10.2698 13.4629 10.0786 13.5423 9.87913 13.5423C9.67969 13.5423 9.48846 13.4629 9.34772 13.3216L6.43172 10.3936C6.13943 10.1001 6.1404 9.62519 6.43389 9.3329Z" fill="black" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M13.6234 5.18995C13.6614 4.77748 14.0266 4.47394 14.4391 4.51198C16.2864 4.6823 17.7854 5.12903 18.7549 6.43724C19.6845 7.69153 20.0002 9.5813 20.0002 12.2588C20.0002 15.8083 19.4434 17.9905 17.6199 19.1104C16.7508 19.6441 15.6745 19.88 14.4424 19.9946C13.2152 20.1088 11.741 20.1088 10.0319 20.1088H9.96862C8.25902 20.1088 6.78452 20.1088 5.55723 19.9946C4.3251 19.88 3.24883 19.6442 2.37983 19.1104C0.556514 17.9904 0.000244141 15.8081 0.000244141 12.2588C0.000244141 9.58138 0.3157 7.69159 1.24515 6.43728C2.2146 5.129 3.71369 4.68229 5.5614 4.51197C5.97387 4.47395 6.33906 4.7775 6.37708 5.18997C6.4151 5.60243 6.11155 5.96762 5.69909 6.00564C3.96679 6.16532 3.02589 6.55362 2.45034 7.33033C1.83479 8.16102 1.50024 9.60623 1.50024 12.2588C1.50024 15.8095 2.09847 17.1772 3.16491 17.8322C3.74079 18.186 4.5432 18.3938 5.69617 18.5011C6.84641 18.6081 8.2528 18.6088 10.0002 18.6088C11.7472 18.6088 13.1533 18.6081 14.3035 18.5011C15.4563 18.3938 16.2588 18.186 16.8349 17.8322C17.9016 17.1771 18.5002 15.8094 18.5002 12.2588C18.5002 9.60632 18.1655 8.16109 17.5498 7.33038C16.9741 6.55359 16.0331 6.16531 14.3014 6.00564C13.8889 5.96761 13.5854 5.60241 13.6234 5.18995Z" fill="black" />
                </svg>
                Exporter
              </motion.button>
              {/* Favorites Counter */}
              <motion.div 
                className="relative flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/favoris')}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                <span>Favoris</span>
                {favorites.length > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {favorites.length}
                  </motion.span>
                )}
              </motion.div>
            </motion.div>
          </div>

          {/* Mobile Dropdown Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                className="sm:hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <motion.button 
                    className="text-gray-900 bg-gray-100 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Paris (75)
                  </motion.button>
                  <motion.button 
                    className="text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Biens publiés (Annonces)
                  </motion.button>
                  <motion.button 
                    className="text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Professionnel
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-blue-400 bg-clip-text text-transparent mb-2">
            Résultats d'achat
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-400 rounded-full mb-4 animate-pulse" />
        </div>
        {/* Results count and items per page */}
        {!loading && properties.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <p className="text-gray-600 text-base">
              Affichage de <span className="font-semibold text-blue-600">{startIndex + 1}</span> à <span className="font-semibold text-blue-600">{Math.min(endIndex, properties.length)}</span> sur <span className="font-semibold text-blue-600">{properties.length}</span> propriétés
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Par page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 shadow"
              >
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
                <option value={18}>18</option>
              </select>
            </div>
          </div>
        )}
        {/* Loading/Error/Empty States */}
        {loading && (
          <div className="text-center text-blue-600 font-semibold mb-4">Chargement des propriétés...</div>
        )}
        {error && (
          <div className="text-center text-red-500 font-semibold mb-4">{error}</div>
        )}
        {!loading && properties && properties.length === 0 && !error && (
          <div className="text-center text-gray-500 font-semibold mb-4">Aucune propriété trouvée.</div>
        )}
        {/* Property Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {currentProperties.map((property, index) => (
            <motion.div 
              key={property.id || index} 
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 shadow-xl overflow-hidden relative border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(80, 0, 200, 0.10)' }}
            >
              <ImageGallery images={property.images || []} tags={property.tags || []} propertyId={property.id} />
              <motion.div 
                className="flex justify-between items-start mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <motion.h2 
                  className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-blue-400 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                >
                  {property.priceText || `${property.price} €`}
                </motion.h2>
              </motion.div>
              <motion.p 
                className="text-gray-700 font-medium mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                {property.propertyType}
              </motion.p>
              <motion.p 
                className="text-gray-600 text-sm mt-1 line-clamp-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                {property.address}
              </motion.p>
              <motion.p 
                className="text-gray-500 text-sm mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                {property.details}
              </motion.p>
              {/* Agency Logo - Bottom Right */}
              <motion.div 
                className="absolute bottom-3 right-3 z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                <img 
                  src={property.images && property.images.length > 0 ? property.images[0] : ''} 
                  alt="Agency Logo" 
                  className="w-12 h-8 rounded-md object-cover border-2 border-white shadow-sm"
                />
              </motion.div>
              <motion.div 
                className="mt-3 flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <div className="flex items-center space-x-2">
                  {property.Association && property.Association.map((association, idx) => (
                    <motion.img
                      key={idx}
                      src={associationLogos[association]}
                      alt={association}
                      className="h-4 w-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.8 + idx * 0.1 }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-600">
              Page {currentPage} sur {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              {/* First Page */}
              <motion.button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md shadow-md font-semibold transition-all duration-200 ${
                  currentPage === 1 
                    ? 'text-gray-300 bg-gray-100 cursor-not-allowed' 
                    : 'text-blue-600 bg-gradient-to-r from-blue-100 to-purple-100 hover:bg-gradient-to-r hover:from-blue-200 hover:to-purple-200'
                }`}
                whileHover={currentPage !== 1 ? { scale: 1.08 } : {}}
                whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
              >
                <ChevronFirst className="h-4 w-4" />
              </motion.button>
              {/* Previous Page */}
              <motion.button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md shadow-md font-semibold transition-all duration-200 ${
                  currentPage === 1 
                    ? 'text-gray-300 bg-gray-100 cursor-not-allowed' 
                    : 'text-blue-600 bg-gradient-to-r from-blue-100 to-purple-100 hover:bg-gradient-to-r hover:from-blue-200 hover:to-purple-200'
                }`}
                whileHover={currentPage !== 1 ? { scale: 1.08 } : {}}
                whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.button>
              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {getPageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === '...' ? (
                      <span className="px-3 py-2 text-gray-400">...</span>
                    ) : (
                      <motion.button
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg font-semibold text-sm shadow-md transition-all duration-200 ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-105 shadow-lg'
                            : 'text-blue-600 bg-gradient-to-r from-blue-100 to-purple-100 hover:bg-gradient-to-r hover:from-blue-200 hover:to-purple-200'
                        }`}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {page}
                      </motion.button>
                    )}
                  </React.Fragment>
                ))}
              </div>
              {/* Next Page */}
              <motion.button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md shadow-md font-semibold transition-all duration-200 ${
                  currentPage === totalPages 
                    ? 'text-gray-300 bg-gray-100 cursor-not-allowed' 
                    : 'text-blue-600 bg-gradient-to-r from-blue-100 to-purple-100 hover:bg-gradient-to-r hover:from-blue-200 hover:to-purple-200'
                }`}
                whileHover={currentPage !== totalPages ? { scale: 1.08 } : {}}
                whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.button>
              {/* Last Page */}
              <motion.button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md shadow-md font-semibold transition-all duration-200 ${
                  currentPage === totalPages 
                    ? 'text-gray-300 bg-gray-100 cursor-not-allowed' 
                    : 'text-blue-600 bg-gradient-to-r from-blue-100 to-purple-100 hover:bg-gradient-to-r hover:from-blue-200 hover:to-purple-200'
                }`}
                whileHover={currentPage !== totalPages ? { scale: 1.08 } : {}}
                whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
              >
                <ChevronLast className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        )}
      </main>
      {/* Mobile navigation */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 bg-white/90 border-t border-gray-200 md:hidden shadow-2xl backdrop-blur-xl z-40"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-around">
          <motion.button 
            className="flex flex-col items-center py-3 px-4 text-blue-600"
            whileTap={{ scale: 0.9 }}
            whileHover={{ y: -3 }}
            onClick={() => navigate('/')}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Accueil</span>
          </motion.button>
          <motion.button 
            className="flex flex-col items-center py-3 px-4 text-purple-600"
            whileTap={{ scale: 0.9 }}
            whileHover={{ y: -3 }}
            onClick={() => navigate('/acheter')}
          >
            <Search className="h-6 w-6" />
            <span className="text-xs mt-1">Recherche</span>
          </motion.button>
          <motion.button 
            className="flex flex-col items-center py-3 px-4 text-pink-500"
            whileTap={{ scale: 0.9 }}
            whileHover={{ y: -3 }}
            onClick={() => navigate('/favoris')}
          >
            <Heart className="h-6 w-6" />
            <span className="text-xs mt-1">Favoris</span>
          </motion.button>
          <motion.button 
            className="flex flex-col items-center py-3 px-4 text-gray-500"
            whileTap={{ scale: 0.9 }}
            whileHover={{ y: -3 }}
            onClick={() => navigate('/profil')}
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profil</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default RecherchAcheter; 