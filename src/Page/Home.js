import React, { useState } from 'react';
import logo from "../Page/HomeAssets/image1.svg"
import logo2 from "../Page/HomeAssets/image2.svg"
import logo3 from "../Page/HomeAssets/image3.svg"
import logo4 from "../Page/HomeAssets/image4.svg"
import { Home, Search, BarChart2, Users, ArrowRight, MapPin, Euro, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Index() {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('buy');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [address, setAddress] = useState('');

  const handleSearch = () => {
    if (searchType === 'buy') {
      navigate('/achat');
    } else {
      navigate('/Louer');
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Gradient Glow */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-blue-400 via-purple-300 to-pink-300 opacity-30 rounded-full blur-3xl animate-pulse z-0" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-gradient-to-br from-purple-200 via-blue-200 to-pink-100 opacity-20 rounded-full blur-2xl z-0" />
      {/* Hero Section */}
      <section className="w-full flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-4 sm:px-8 pt-20 pb-20 relative z-10 animate-fade-in">
        {/* Left Side */}
        <div className="flex-1 max-w-xl w-full">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Où les <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-400 bg-clip-text text-transparent">rêves immobiliers</span> prennent vie
          </h1>
          <p className="text-gray-500 text-lg mb-4">
            IMMOXPERT, l'outil essentiel pour simplifier tous vos projets immobiliers, que vous soyez particulier ou professionnel.
          </p>
        </div>
        {/* Right Side */}
        <div className="flex-1 flex justify-center items-center mt-12 lg:mt-0 w-full">
          {/* Placeholder for map illustration */}
          <div className="relative w-[420px] h-[340px] bg-white/60 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden border border-gray-100 backdrop-blur-xl" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)'}}>
            {/* Simple SVG map illustration with points and a floating card */}
            <svg width="100%" height="100%" viewBox="0 0 420 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
              <rect width="420" height="340" rx="24" fill="#F3F4F6" />
              <g opacity="0.5">
                <path d="M60 60 Q120 40 180 80 T300 120 Q360 160 380 220 T320 300 Q260 340 200 300 T100 260 Q40 220 60 160 T60 60 Z" stroke="#D1D5DB" strokeWidth="3" fill="none" />
                <circle cx="90" cy="90" r="8" fill="#6366F1" />
                <circle cx="200" cy="120" r="8" fill="#6366F1" />
                <circle cx="320" cy="180" r="8" fill="#6366F1" />
                <circle cx="150" cy="250" r="8" fill="#6366F1" />
                <circle cx="270" cy="270" r="8" fill="#6366F1" />
              </g>
            </svg>
            {/* Floating card with glassmorphism */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/70 rounded-xl shadow-xl border border-gray-100 px-6 py-4 w-56 flex flex-col items-center backdrop-blur-md ring-1 ring-white/40" style={{boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.10)'}}>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-3 h-3 bg-indigo-400 rounded-full"></span>
                <span className="font-semibold text-indigo-600">Maison</span>
              </div>
              <div className="h-2 w-full bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full mb-2" />
              <div className="w-full h-8 bg-gray-100 rounded mb-1" />
              <div className="w-2/3 h-3 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* Explorer Section */}
      <section className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 mb-16 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6 order-2 md:order-1">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl shadow-lg">
                <Search className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Explorer</h2>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                  les biens disponibles
                </h2>
              </div>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">
              Effectuez une recherche approfondie pour découvrir le bien immobilier qui répond parfaitement à vos attentes et besoins.
            </p>
          </div>

          <div className="relative order-1 md:order-2">
            <img
              src={logo}
              alt="Explorer Logo"
              className="object-contain cursor-pointer w-full"
            />
          </div>
        </div>
      </section>

      {/* Past Sales Section */}
      <section className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 mb-16 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-700 to-purple-500 bg-clip-text text-transparent mb-4">
            On vous guide à chaque étape de votre projet immobilier !
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4" />
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Nous vous offrons toutes les infos nécessaires pour mieux comprendre le marché immobilier et faire un choix éclairé.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative">
            <img
              src={logo2}
              alt="Past Sales Logo"
              className="object-contain cursor-pointer w-full"
            />
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">Ventes Passées</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Informations détaillées pour une analyse approfondie des transactions immobilières dans votre région.
            </p>
            <button className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-purple-600 transition-colors duration-200 group">
              Découvrez-les dès maintenant
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </section>

      {/* Estimation Section */}
      <section className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 mb-16 border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl shadow-lg">
            <BarChart2 className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">Estimation</h3>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Left Section (Text) */}
          <div className="w-full md:w-1/2">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl shadow border border-gray-100">
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Estimation rapide d'un bien immobilier.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Rapports d'estimation immobilière précis et détaillés.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Présentez vos dossiers d'investissement à votre banque grâce à nos outils de simulation de rentabilité pour investisseurs.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Section (Image) */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={logo3}
              alt="Estimation Logo"
              className="object-contain cursor-pointer max-w-md"
            />
          </div>
        </div>
      </section>

      {/* Market Study Section */}
      <section className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 mb-16 border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-xl shadow-lg">
            <BarChart2 className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">Étude du marché</h3>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl shadow border border-gray-100">
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Explorez les tendances immobilières grâce à nos indicateurs clés de performance, qui vous offrent une vision claire du marché.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Consultez notre carte interactive des prix au m² et suivez l'évolution des tarifs en France pour mieux orienter vos décisions.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Real Estate Agents Section */}
      <section className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 mb-16 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div className="relative order-2 md:order-1">
            <img
              src={logo4}
              alt="Agents Logo"
              className="object-contain cursor-pointer w-full"
            />
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Agents</h2>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                  Immobiliers
                </h2>
              </div>
            </div>
            
            <p className="text-gray-600 text-lg leading-relaxed">
              Trouvez un agent immobilier ou une agence près de chez vous pour vous accompagner dans votre projet immobilier.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden mb-16">
        <div className="px-8 py-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à réaliser vos rêves immobiliers ?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
            Rejoignez des milliers de personnes qui ont déjà trouvé leur bien idéal grâce à ImmoXpert.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-200 ease-in-out font-semibold shadow-md">
            Commencer maintenant
          </button>
        </div>
      </section>

      {/* Bottom Banner */}
      <div className="text-center pt-8 border-t border-gray-200">
        <p className="text-gray-500 text-sm max-w-3xl mx-auto">
          ImmoXpert - Votre partenaire de confiance pour tous vos projets immobiliers en France. Estimation, recherche, et accompagnement personnalisé.
        </p>
      </div>
    </div>
  );
}

export default Index;