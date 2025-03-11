import React, { useState } from 'react';
import { Home, Search, Heart, User, ChevronLeft,ChevronDown , ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RecherchLouer = () => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    };
  // Sample property data
  const properties = [
    {
      id: 1,
      price: '1 210 €',
      type: 'Appartement meublé',
      description: 'Idéalement situé à proximité de la Place des Vosges, au 5ème étage...',
      surface: '85 m²',
      rooms: '3 (2 chambres)',
      bathrooms: '2',
      kitchen: 'équipée',
      balcony: 'Oui',
      address: '12 Rue de Rivoli, 75001 Paris, France',
      tags: ['En vente', 'Géolocalisé', 'SeLoger'],
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1080&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1080&q=80'
      ]    
    },
    {
      id: 2,
      price: '720 €',
      type: 'Appartement meublé',
      description: 'Venez découvrir ce studio de 31.11m² Loi Carrez baigné de lumière naturelle...',
      surface: '31 m²',
      rooms: '2 (2 chambres)',
      bathrooms: '1',
      kitchen: 'équipée',
      balcony: 'Non',
      address: '12 Rue de Rivoli, 75001 Paris, France',
      tags: ['En vente', 'Baisse de prix', 'leboncoin'],
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80'
      ]
    },
    {
      id: 3,
      price: '915 €',
      type: 'Appartement meublé',
      description: 'En plein cœur du Marais et dans un bel immeuble ancien parfaitement entretenu...',
      surface: '38 m²',
      rooms: '2 (2 chambres)',
      bathrooms: '1',
      kitchen: 'équipée',
      balcony: 'Oui',
      address: '12 Rue de Rivoli, 75001 Paris, France',
      tags: ['En vente', 'SeLoger'],
      images: [
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80'
      
      ]
    },
    {
      id: 4,
      price: '1 410 €',
      type: 'Appartement meublé',
      description: 'Magnifique appartement avec vue dégagée...',
      surface: '92 m²',
      rooms: '4 (3 chambres)',
      bathrooms: '2',
      kitchen: 'équipée',
      balcony: 'Oui',
      address: '12 Rue de Rivoli, 75001 Paris, France',
      tags: ['En vente', 'SeLoger'],
      images: [
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80'
      
      ]
    },
    {
      id: 5,
      price: '1 050 €',
      type: 'Appartement meublé',
      description: 'Charmant appartement haussmannien...',
      surface: '65 m²',
      rooms: '3 (2 chambres)',
      bathrooms: '1',
      kitchen: 'équipée',
      balcony: 'Non',
      address: '12 Rue de Rivoli, 75001 Paris, France',
      tags: ['En vente', 'Géolocalisé', 'leboncoin', 'leboncoin'],
      images: [
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80'
      
      ]
    },
    {
      id: 6,
      price: '940 €',
      type: 'Appartement meublé',
      description: 'Bel appartement rénové avec goût...',
      surface: '45 m²',
      rooms: '2 (1 chambre)',
      bathrooms: '1',
      kitchen: 'équipée',
      balcony: 'Non',
      address: '12 Rue de Rivoli, 75001 Paris, France',
      tags: ['Expiré'],
      images: [
        'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80'
      
      ]
    }
  ];

// Function to render tags
const renderTags = (tags) => {
    const tagColorMap = {
      'En vente': 'bg-green-500',
      'Géolocalisé': 'bg-orange-400',
      'SeLoger': 'bg-indigo-500',
      'Baisse de prix': 'bg-green-500',
      'leboncoin': 'bg-indigo-400',
      'Expiré': 'bg-red-500',
      'default': 'bg-gray-500'
    };
  
    return tags.map((tag, index) => (
      <span 
        key={index} 
        className={`${tagColorMap[tag] || tagColorMap['default']} text-white text px-3 py-2 rounded-lg mr-1`}
      >
        {tag}
      </span>
    ));
  };
  

  const ImageGallery = ({ images, tags }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
  
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
      if (isHovering && images.length > 1) {
        intervalId = setInterval(() => {
          setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 1500); // Change image every 1 second
      }
  
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }, [isHovering, images.length]);
  
    return (
      <div 
        className="relative h-60 overflow-hidden rounded-2xl group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt={`Property image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover rounded-3xl absolute"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute top-2 left-2 flex pb-1 flex-wrap gap-1 z-10">
            {renderTags(tags)}
          </div>
          <button className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white z-10">
            <Heart className="h-5 w-5 text-gray-500 hover:text-red-500" />
          </button>
  
          {/* Image Indicator Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </AnimatePresence>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="  mt-10 rounded-2xl ">
      <div className="max-w-7xl mx-auto  sm:px-6 lg:px-8">
        <div className="flex justify-between items-center pt-4">
          {/* Desktop Menu */}
          <div className="hidden sm:flex space-x-4 rounded-xl border py-2 pr-60 px-4 bg-white shadow-sm">
            <button className="px-5 py-3 rounded-xl text-sm font-medium text-gray-900 bg-gray-100">
              Paris (75)
            </button>
            <button className="px-3 py-2 rounded-xl text-sm font-medium text-gray-900 bg-gray-100">
              Biens publiés (Annonces)
            </button>
            <button className="px-3 py-2 rounded-xl text-sm font-medium text-gray-900 bg-gray-100">
              Professionnel
            </button>
          </div>
          
          {/* Mobile Menu Toggle */}
          <div className="sm:hidden flex items-center w-full justify-between">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100">
                Date de la vente
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100">
               


               
                Exporter
              </button>
            </div>
          </div>

          {/* Desktop Right Side Menu */}
          <div className="hidden sm:flex items-center space-x-4">
            <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100">
              Date de la vente
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100">
            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.87915 0.00012207C10.2934 0.00012207 10.6292 0.335909 10.6292 0.750122V12.7911C10.6292 13.2053 10.2934 13.5411 9.87915 13.5411C9.46494 13.5411 9.12915 13.2053 9.12915 12.7911V0.750122C9.12915 0.335909 9.46494 0.00012207 9.87915 0.00012207Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.43389 9.3329C6.72739 9.04061 7.20226 9.04158 7.49455 9.33508L9.87913 11.7295L12.2637 9.33508C12.556 9.04158 13.0309 9.04061 13.3244 9.3329C13.6179 9.62519 13.6188 10.1001 13.3266 10.3936L10.4106 13.3216C10.2698 13.4629 10.0786 13.5423 9.87913 13.5423C9.67969 13.5423 9.48846 13.4629 9.34772 13.3216L6.43172 10.3936C6.13943 10.1001 6.1404 9.62519 6.43389 9.3329Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M13.6234 5.18995C13.6614 4.77748 14.0266 4.47394 14.4391 4.51198C16.2864 4.6823 17.7854 5.12903 18.7549 6.43724C19.6845 7.69153 20.0002 9.5813 20.0002 12.2588C20.0002 15.8083 19.4434 17.9905 17.6199 19.1104C16.7508 19.6441 15.6745 19.88 14.4424 19.9946C13.2152 20.1088 11.741 20.1088 10.0319 20.1088H9.96862C8.25902 20.1088 6.78452 20.1088 5.55723 19.9946C4.3251 19.88 3.24883 19.6442 2.37983 19.1104C0.556514 17.9904 0.000244141 15.8081 0.000244141 12.2588C0.000244141 9.58138 0.3157 7.69159 1.24515 6.43728C2.2146 5.129 3.71369 4.68229 5.5614 4.51197C5.97387 4.47395 6.33906 4.7775 6.37708 5.18997C6.4151 5.60243 6.11155 5.96762 5.69909 6.00564C3.96679 6.16532 3.02589 6.55362 2.45034 7.33033C1.83479 8.16102 1.50024 9.60623 1.50024 12.2588C1.50024 15.8095 2.09847 17.1772 3.16491 17.8322C3.74079 18.186 4.5432 18.3938 5.69617 18.5011C6.84641 18.6081 8.2528 18.6088 10.0002 18.6088C11.7472 18.6088 13.1533 18.6081 14.3035 18.5011C15.4563 18.3938 16.2588 18.186 16.8349 17.8322C17.9016 17.1771 18.5002 15.8094 18.5002 12.2588C18.5002 9.60632 18.1655 8.16109 17.5498 7.33038C16.9741 6.55359 16.0331 6.16531 14.3014 6.00564C13.8889 5.96761 13.5854 5.60241 13.6234 5.18995Z" fill="black"/>
</svg>
              Exporter
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button className="text-gray-900 bg-gray-100 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                Paris (75)
              </button>
              <button className="text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                Biens publiés (Annonces)
              </button>
              <button className="text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                Professionnel
              </button>
            </div>
          </div>
        )}
      </div>
    </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-3xl p-3 shadow-md overflow-hidden">
              <ImageGallery images={property.images} tags={property.tags} />
              
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-900">{property.price}</h2>
                </div>
                <p className="text-gray-700 font-medium mt-1">{property.type}</p>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{property.description}</p>
                
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Surface: </span>
                    <span className="font-medium">{property.surface}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Pièces: </span>
                    <span className="font-medium">{property.rooms}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Salles de bain: </span>
                    <span className="font-medium">{property.bathrooms}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Cuisine: </span>
                    <span className="font-medium">{property.kitchen}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Balcon: </span>
                    <span className="font-medium">{property.balcony}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center text-xs text-gray-500">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  {property.address}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Mobile navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="flex justify-around">
          <button className="flex flex-col items-center py-3 px-4 text-indigo-600">
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Accueil</span>
          </button>
          <button className="flex flex-col items-center py-3 px-4 text-gray-500">
            <Search className="h-6 w-6" />
            <span className="text-xs mt-1">Recherche</span>
          </button>
          <button className="flex flex-col items-center py-3 px-4 text-gray-500">
            <Heart className="h-6 w-6" />
            <span className="text-xs mt-1">Favoris</span>
          </button>
          <button className="flex flex-col items-center py-3 px-4 text-gray-500">
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecherchLouer;