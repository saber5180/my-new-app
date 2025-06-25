import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiCheckSquare, FiSearch, FiMapPin, FiDollarSign } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { setBuySearchParams } from '../features/propertyBuySlice';

const Acheter = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [propertyType, setPropertyType] = useState('tous');
  const [localisation, setLocalisation] = useState('');
  const [budget, setBudget] = useState('');

  const cities = [
    { name: 'Paris', url: '#' },
    { name: 'Lyon', url: '#' },
    { name: 'Marseille', url: '#' },
    { name: 'Toulouse', url: '#' },
    { name: 'Bordeaux', url: '#' },
    { name: 'Nice', url: '#' },
    { name: 'Nantes', url: '#' },
    { name: 'Strasbourg', url: '#' },
    { name: 'Montpellier', url: '#' },
    { name: 'Lille', url: '#' },
    { name: 'Rennes', url: '#' }
  ];
  
  const benefits = [
    { 
      title: 'Démarches faciles', 
      description: 'Simplifiez vos formalités en ligne',
      icon: <FiCheckSquare className="text-blue-500 w-5 h-5 flex-shrink-0" />
    },
    { 
      title: 'Large choix', 
      description: 'Appartements et maisons',
      icon: <FiHome className="text-blue-500 w-5 h-5 flex-shrink-0" />
    },
    { 
      title: 'Agents fiables', 
      description: 'Profitez de conseils d\'experts locaux',
      icon: <FiCheckSquare className="text-blue-500 w-5 h-5 flex-shrink-0" />
    },
    { 
      title: 'Interface intuitive', 
      description: 'Navigation simple et rapide',
      icon: <FiCheckSquare className="text-blue-500 w-5 h-5 flex-shrink-0" />
    },
    { 
      title: 'Estimation de prix', 
      description: 'Accès direct aux contacts',
      icon: <FiCheckSquare className="text-blue-500 w-5 h-5 flex-shrink-0" />
    }
  ];
  
  const testimonials = [
    {
      id: 1,
      name: 'Pierre Martin',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      text: 'Un large choix de biens immobiliers, avec une navigation fluide et agréable. J\'ai pu organiser plusieurs visites en quelques clics. Un service au top !'
    },
    {
      id: 2,
      name: 'Chloé Dubois',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      text: 'Grâce à ImmoXpert, j\'ai trouvé mon appartement en un temps record. Le site est intuitif et très bien conçu. Une vraie aide pour la recherche de logement.'
    },
    {
      id: 3,
      name: 'Camille Durand',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      text: 'Une plateforme vraiment bien pensée pour chercher un logement. J\'ai trouvé exactement ce que je voulais, et le service client est réactif.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-16 bg-white/80 backdrop-blur-xl border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-100 to-blue-100 opacity-80" />
          <div className="relative z-10 py-10 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-start items-center">
              <div className="bg-white/90 rounded-2xl p-8 max-w-md w-full shadow-lg border border-gray-100">
                <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-blue-400 bg-clip-text text-transparent mb-2">Acheter le bien qui correspond à mes attentes</h1>
                <div className="h-1 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-400 rounded-full mb-4 animate-pulse" />
                <p className="text-gray-600 mb-6">Appartements ou maisons, découvrez une large sélection pour donner vie à votre projet d'achat.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Ville, quartier, région" 
                        className="w-full py-2.5 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white/80 shadow"
                        value={localisation}
                        onChange={e => setLocalisation(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget maximum</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="number" 
                        className="w-full py-2.5 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white/80 shadow" 
                        value={budget}
                        onChange={e => setBudget(e.target.value)}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="tous" 
                        checked={propertyType === 'tous'} 
                        onChange={() => setPropertyType('tous')}
                        className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
                      />
                      <label htmlFor="tous" className="ml-2 text-sm font-medium text-gray-700">Tous</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="maison" 
                        checked={propertyType === 'maison'} 
                        onChange={() => setPropertyType('maison')}
                        className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
                      />
                      <label htmlFor="maison" className="ml-2 text-sm font-medium text-gray-700">Maison</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="appartement" 
                        checked={propertyType === 'appartement'} 
                        onChange={() => setPropertyType('appartement')}
                        className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
                      />
                      <label htmlFor="appartement" className="ml-2 text-sm font-medium text-gray-700">Appartement</label>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      dispatch(setBuySearchParams({
                        postalCode: localisation,
                        propertyType: propertyType === 'tous' ? '' : propertyType,
                        price: budget
                      }));
                      navigate("/RecherchAcheter");
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition duration-200 ease-in-out flex items-center justify-center font-semibold shadow-lg"
                  >
                    <FiSearch className="mr-2 h-5 w-5" />
                    Rechercher
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Cities Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 mb-16 border border-gray-100">
          <h2 className="text-xl font-bold text-center bg-gradient-to-r from-blue-700 to-purple-500 bg-clip-text text-transparent mb-6">Acheter en France | Top villes</h2>
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2 text-gray-700 text-sm">
              {cities.map((city, index) => (
                <Link 
                  key={city.name} 
                  to={city.url} 
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full hover:from-purple-200 hover:to-blue-200 hover:text-blue-700 transition duration-200"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Benefits Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden mb-16 border border-gray-100">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-500 bg-clip-text text-transparent mb-6">Facilitez l'achat d'un bien immobilier</h2>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-3 mt-0.5">{benefit.icon}</div>
                    <div>
                      <span className="font-medium text-gray-800">{benefit.title}: </span>
                      <span className="text-gray-600">{benefit.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                alt="Couple looking at property" 
                className="h-full w-full object-cover rounded-br-2xl"
              />
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden mb-16">
          <div className="px-8 py-12 text-white">
            <h2 className="text-2xl font-bold mb-4">ImmoXpert vous offre une plateforme moderne</h2>
            <p className="text-blue-100 mb-8 max-w-2xl">
              Grâce à nos filtres de recherche intuitifs, vous trouverez rapidement la propriété qui correspond à vos besoins.
            </p>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-200 ease-in-out font-medium shadow-md">
              S'inscrire maintenant
            </button>
          </div>
        </div>
        
        {/* Testimonials Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 mb-16 border border-gray-100">
          <h2 className="text-xl font-bold text-center bg-gradient-to-r from-blue-700 to-purple-500 bg-clip-text text-transparent mb-10">Ce que disent nos clients satisfaits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow border border-gray-100">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4 border-2 border-white shadow-sm"
                  />
                  <span className="font-medium text-gray-800">{testimonial.name}</span>
                </div>
                <p className="text-gray-600 text-sm italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom Banner */}
        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm max-w-3xl mx-auto">
            ImmoXpert est votre plateforme de référence pour la location et l'achat de maisons et d'appartements en France - Découvrez une large sélection de biens immobiliers adaptés à vos besoins
          </p>
        </div>
      </div>
    </div>
  );
};

export default Acheter; 