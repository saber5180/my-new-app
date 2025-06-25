import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Estimation() {
  const [propertyType, setPropertyType] = useState('house');
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-teal-100 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-16 bg-white/80 backdrop-blur-xl border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-200 via-emerald-100 to-teal-100 opacity-80" />
          <div className="relative z-10 py-10 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-start items-center">
              <div className="bg-white/90 rounded-2xl p-8 max-w-lg w-full shadow-lg border border-gray-100">
                <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent mb-2">
                  Quelle est l'adresse du logement à estimer ?
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 rounded-full mb-4 animate-pulse" />
                <p className="text-gray-600 mb-6">
                  Accédez à une vaste base de données immobilières et obtenez une 
                  estimation gratuite de votre bien en ligne en quelques secondes.
                </p>

                <div className="relative mb-6">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Entrez une adresse"
                    className="w-full pl-10 pr-4 py-3 bg-white/80 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 shadow"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <label className="sm:flex-1">
                    <input
                      type="radio"
                      className="hidden"
                      checked={propertyType === 'house'}
                      onChange={() => setPropertyType('house')}
                    />
                    <div className={`cursor-pointer rounded-lg p-3 text-center border transition-all duration-200 ${
                      propertyType === 'house' 
                        ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-500 text-emerald-700 shadow-md' 
                        : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                    }`}>
                      Maison
                    </div>
                  </label>
                  <label className="sm:flex-1">
                    <input
                      type="radio"
                      className="hidden"
                      checked={propertyType === 'apartment'}
                      onChange={() => setPropertyType('apartment')}
                    />
                    <div className={`cursor-pointer rounded-lg p-3 text-center border transition-all duration-200 ${
                      propertyType === 'apartment' 
                        ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-500 text-emerald-700 shadow-md' 
                        : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                    }`}>
                      Appartement
                    </div>
                  </label>
                </div>

                <button 
                  onClick={() => navigate("/EstimationRechercher")} 
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 px-4 rounded-lg hover:from-teal-600 hover:to-emerald-600 transition duration-200 ease-in-out flex items-center justify-center font-semibold shadow-lg"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 mb-16 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent mb-4">
              Obtenez une estimation immédiate de la valeur
              <br />de votre maison
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mx-auto mb-4" />
            <p className="text-gray-600 max-w-2xl mx-auto">
              Essayez notre outil d'évaluation immobilière en ligne gratuit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Résultats instantanés :",
                description: "Pas d'attente. Notre outil vous fournit une estimation immédiate de la valeur de votre bien.",
                icon: "⚡"
              },
              {
                title: "Précision basée sur les données :",
                description: "Nous utilisons les dernières données du marché et des algorithmes avancés pour calculer la valeur de votre maison, sans approximation.",
                icon: "📊"
              },
              {
                title: "Sans engagement :",
                description: "Ce service est totalement gratuit et sans obligation. Vous pouvez l'utiliser aussi souvent que vous le souhaitez.",
                icon: "🆓"
              },
              {
                title: "100 % en ligne :",
                description: "Pas besoin de rendez-vous ni de paperasse. Obtenez votre estimation confortablement chez vous, 24 h/24, 7 j/7.",
                icon: "💻"
              }
            ].map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl shadow border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start">
                  <span className="text-2xl mr-4">{item.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-xl overflow-hidden mb-16">
          <div className="px-8 py-12 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Estimez votre bien en quelques clics</h2>
            <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
              Notre outil d'estimation utilise les dernières données du marché pour vous donner une évaluation précise et fiable de votre propriété.
            </p>
            <button 
              onClick={() => navigate("/EstimationRechercher")}
              className="bg-white text-emerald-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-200 ease-in-out font-semibold shadow-md"
            >
              Commencer l'estimation
            </button>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm max-w-3xl mx-auto">
            ImmoXpert vous offre un outil d'estimation gratuit et précis pour évaluer la valeur de votre bien immobilier - Utilisez nos données fiables du marché français
          </p>
        </div>
      </div>
    </div>
  );
}

export default Estimation;