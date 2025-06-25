import React, { useState, useEffect } from 'react';
import { MapPin, Globe, Building, Home, Briefcase, Map, ParkingSquare, Plus, Minus } from 'lucide-react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ContactAgentPopup from './ContactAgentPopup';

const API_BASE_URL = 'http://localhost:8080';
const getImageUrl = (image) => {
  if (!image) return 'https://via.placeholder.com/80';
  if (image.startsWith('http')) return image;
  return `${API_BASE_URL}/images/${image}`;
};

const VoirLagence = () => {
  const location = useLocation();
  const agencyData = location.state?.agency; // Get agency data from state
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (agencyData && agencyData.email) {
      axios.get(`${API_BASE_URL}/api/agents/agence/email/${agencyData.email}`)
        .then(res => {
          setAgents(res.data.map(agent => ({
            ...agent,
            name: `${agent.prenom} ${agent.nom}`,
            avatar: getImageUrl(agent.image),
            position: 'Agent immobilier',
          })));
        });
    }
  }, [agencyData]);

  const handleOpenContact = (agent) => {
    setSelectedAgent(agent);
    setIsPopupOpen(true);
  };
  const handleCloseContact = () => {
    setSelectedAgent(null);
    setIsPopupOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-50 pb-12">
      <main className="container mx-auto px-2 md:px-10 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left content - Agency information */}
          <div className="w-full lg:w-2/3">
            {/* Animated Agency Banner */}
            <div className="relative rounded-3xl overflow-hidden mb-8 shadow-xl border border-gray-100 bg-gradient-to-br from-indigo-200/40 to-purple-100/60 animate-fadeIn">
              <img 
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Agency Banner" 
                className="w-full h-64 object-cover opacity-80 scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-6 left-6 bg-white/90 p-4 rounded-2xl shadow-lg flex items-center gap-4 animate-slideUp">
                <img 
                  src={agencyData.logo}
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-gradient-to-br from-blue-400 to-purple-400 shadow-md -mt-12 animate-float"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight animate-fadeIn">{agencyData.name}</h1>
                  <h2 className="text-gray-700 font-medium animate-fadeIn">Agence immobilière</h2>
                  <div className="flex items-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-yellow-400" fill={star <= agencyData.rating ? "currentColor" : "none"} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Breadcrumb */}
            <div className="text-xs text-gray-500 mb-6 px-2 animate-fadeIn">
              Agence immobilière &gt; {agencyData.postalCode && agencyData.postalCode.substring(0, 2)}-{agencyData.city} &gt; {agencyData.city} &gt; {agencyData.postalCode}
            </div>

            {/* Agency Info Cards */}
            <div className="flex flex-col md:flex-row gap-6 mb-8 animate-fadeIn">
              <div className="flex items-center text-gray-600 bg-gradient-to-r from-indigo-50 to-purple-50 p-3 px-6 rounded-2xl border border-gray-100 shadow">
                <MapPin className="mr-2 text-indigo-500" size={20} />
                <span className="font-medium">{agencyData.address}, {agencyData.postalCode} {agencyData.city}, France</span>
              </div>
              <div className="flex items-center bg-gradient-to-r from-indigo-50 to-purple-50 p-3 px-6 rounded-2xl border border-gray-100 shadow">
                <Globe className="mr-2 text-purple-500" size={20} />
                <a href="#" className="hover:underline font-medium text-indigo-700">www.{agencyData.name ? agencyData.name.toLowerCase().replace(/\s+/g, '') : 'nestenn'}.com</a>
              </div>
            </div>

            {/* Sales Analysis */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              {/* Properties Sold */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl border border-blue-100 shadow animate-slideUp">
                <div className="flex items-center mb-4">
                  <Building className="text-blue-600 mr-2" size={24} />
                  <span className="text-2xl font-bold text-blue-900 animate-fadeInNumber">{agencyData.totalTransactions || 359}</span>
                </div>
                <p className="text-gray-600 mb-4">Biens vendus</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Appartement</span>
                    <span className="font-medium">200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maison</span>
                    <span className="font-medium">72</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commerce/Industrie</span>
                    <span className="font-medium">14</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Terrain</span>
                    <span className="font-medium">22</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Place de parking</span>
                    <span className="font-medium">4</span>
                  </div>
                </div>
              </div>
              {/* Median Sale Price */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-100 p-6 rounded-2xl border border-purple-100 shadow animate-slideUp">
                <div className="flex items-center mb-4">
                  <Building className="text-purple-600 mr-2" size={24} />
                  <span className="text-2xl font-bold text-purple-900 animate-fadeInNumber">{agencyData.averagePrice || '230k EUR'}</span>
                </div>
                <p className="text-gray-600 mb-4">Prix de vente médian</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Appartement</span>
                    <span className="font-medium">126k EUR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maison</span>
                    <span className="font-medium">259k EUR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commerce/Industrie</span>
                    <span className="font-medium">182k EUR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Terrain</span>
                    <span className="font-medium">204k EUR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Place de parking</span>
                    <span className="font-medium">12k EUR</span>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="mb-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-gray-100 shadow p-6 animate-fadeIn">
              <h2 className="text-xl font-bold mb-4 text-indigo-900">A propos</h2>
              <blockquote className="italic text-gray-700 mb-2 border-l-4 border-indigo-400 pl-4">{agencyData.name || 'Nestenn'}, une agence immobilière moderne qui réinvente l'expérience de vente immobilière !</blockquote>
              <p className="text-gray-600 mb-2">
                Rapidement compris qu'au-delà des nouvelles technologies nécessaires pour ...
              </p>
              <button className="text-cyan-600 hover:underline font-semibold">Afficher plus</button>
            </div>

            {/* Team Section */}
            <div className="mb-8 animate-fadeIn">
              <h2 className="text-xl font-bold mb-4 text-indigo-900">L'équipe</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                {agents && agents.length > 0 ? (
                  agents.map((agent, index) => (
                    <button key={agent.id || index} onClick={() => handleOpenContact(agent)} className="flex flex-col items-center bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl border border-gray-100 shadow-md p-4 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                      <div className="relative mb-3">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 p-1 shadow">
                          <img 
                            src={agent.avatar}
                            alt={agent.name}
                            className="w-full h-full rounded-full object-cover shadow-sm hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-center text-gray-800 text-base mb-1">{agent.name}</h3>
                      <p className="text-xs text-gray-500 text-center mb-2">{agent.position || 'Agent immobilier'}</p>
                      <span className="text-pink-500 text-xs font-semibold bg-pink-50 hover:bg-pink-100 rounded-xl px-4 py-1 mt-1 transition-all duration-200 shadow-sm cursor-pointer">Voir Plus</span>
                    </button>
                  ))
                ) : (
                  <div className="col-span-4 text-center text-gray-400 py-8">Aucun agent trouvé pour cette agence.</div>
                )}
              </div>
              <button className="text-cyan-600 hover:underline font-semibold">Afficher plus</button>
            </div>

            {/* Recent Sales */}
            <div className="mb-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-gray-100 shadow p-6 animate-fadeIn">
              <h2 className="text-xl font-bold mb-4 text-indigo-900">Ventes récentes</h2>
              {/* Map */}
              <div className="relative h-80 bg-gray-200 rounded-lg mb-6 overflow-hidden">
                <MapContainer 
                  center={[48.8566, 2.3522]} 
                  zoom={13} 
                  className="w-full h-full"
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </MapContainer>
                <div className="absolute top-2 right-2 flex flex-col">
                  <button className="bg-white p-1 rounded-md shadow mb-1">
                    <Plus size={20} />
                  </button>
                  <button className="bg-white p-1 rounded-md shadow">
                    <Minus size={20} />
                  </button>
                </div>
              </div>
              {/* Recent Sales List */}
              <div className="space-y-6">
                {/* Sale 1 */}
                <div className="border-b border p-4 shadow rounded-xl bg-white/80">
                  <div className="flex flex-col md:flex-row gap-4">
                    <img 
                      src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                      alt="Apartment" 
                      className="w-32 h-30 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">Appartement • 2 pièces</h3>
                          <p className="text-gray-600">{agencyData.city || 'Lyon'} ({agencyData.postalCode || '69000'})</p>
                          <p className="text-sm text-gray-500">
                            Vendu par {agents[0]?.name || 'Bruno Leroi'} avec {agencyData.name || 'Nestenn'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600">janvier 2025</p>
                        </div>
                      </div>
                      <button className="mt-2 bg-indigo-500 text-white px-6 py-2 rounded-md text-sm" style={{background:"#7069F9"}}>Vendu</button>
                    </div>
                  </div>
                </div>
                {/* Sale 2 */}
                <div className="border-b pb-6 border p-4 shadow rounded-xl bg-white/80">
                  <div className="flex flex-col md:flex-row gap-4">
                    <img 
                      src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                      alt="Apartment" 
                      className="w-32 h-30 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">Appartement • 3 pièces</h3>
                          <p className="text-gray-600">{agencyData.city || 'Lyon'} ({agencyData.postalCode || '69000'})</p>
                          <p className="text-sm text-gray-500">
                            Vendu par {agents[1]?.name || 'Julien Lautier'} avec {agencyData.name || 'Nestenn'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600">janvier 2025</p>
                        </div>
                      </div>
                      <button className="mt-2 text-white px-6 py-2 rounded-md text-sm" style={{background:"#7069F9"}}>Vendu</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Contact Form */}
          <div className="lg:w-1/3 rounded-3xl p-8 h-fit sticky top-1 bg-gradient-to-br from-indigo-50 to-purple-100 border border-gray-100 shadow-xl animate-fadeIn">
            <h2 className="text-center text-lg font-medium mb-2 text-indigo-900">Contactez-nous</h2>
            <h3 className="text-center text-xl font-bold mb-2 text-indigo-900">{agencyData.name || 'NESTENN'}</h3>
            <p className="text-center mb-6 text-gray-600">Consultation gratuite</p>
            <form className="space-y-4">
              <div>
                <input 
                  type="text" 
                  placeholder="Votre nom complet" 
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                />
              </div>
              <div>
                <input 
                  type="tel" 
                  placeholder="Téléphone" 
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                />
              </div>
              <div>
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                />
              </div>
              <div>
                <textarea 
                  placeholder="J'ai découvert votre profil sur Immoxpert et je souhaite entrer en contact avec vous." 
                  rows={3}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                ></textarea>
              </div>
              <div>
                <textarea 
                  placeholder="De quel service avez-vous besoin ?" 
                  rows={2}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                ></textarea>
              </div>
              <button 
                type="button"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
              >
                Contacter gratuitement
              </button>
              <p className="text-xs text-gray-500 mt-4">
                Nous traitons vos données en toute confidentialité et avec le plus grand soin, conformément aux réglementations européennes. En poursuivant, vous acceptez notre Politique de confidentialité et nos Conditions générales.
              </p>
            </form>
          </div>
        </div>
      </main>
      <ContactAgentPopup open={isPopupOpen} agent={selectedAgent} onClose={handleCloseContact} />
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease; }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.25,0.46,0.45,0.94); }
        .animate-float { animation: float 2.5s ease-in-out infinite; }
        .animate-fadeInNumber { animation: fadeIn 1.2s cubic-bezier(0.25,0.46,0.45,0.94); }
      `}</style>
    </div>
  );
}

export default VoirLagence;