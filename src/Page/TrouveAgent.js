import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ContactAgentPopup from './ContactAgentPopup';
import { Users, Mail, Phone, MapPin } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080';

const getImageUrl = (image) => {
  if (!image) return 'https://via.placeholder.com/80';
  if (image.startsWith('http')) return image;
  return `${API_BASE_URL}/images/${image}`;
};

// Enhanced LocalisationSearchPopup with glassmorphism
const LocalisationSearchPopup = ({ open, onClose, onSearch, defaultValue }) => {
  const [value, setValue] = useState(defaultValue || '');
  useEffect(() => { setValue(defaultValue || ''); }, [defaultValue, open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20 animate-scale-in">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-brand to-brand rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Rechercher par localisation
          </h2>
          <p className="text-gray-500">Entrez votre ville ou département</p>
        </div>
        <div className="relative mb-6">
          <input
            autoFocus
            type="text"
            className="w-full rounded-2xl border-2 border-gray-100 px-6 py-4 text-lg focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all bg-white/50 backdrop-blur-sm"
            placeholder="Ex: Toulouse, Haute-Garonne"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { onSearch(value); } }}
          />
        </div>
        <div className="flex gap-3">
          <button
            className="flex-1 rounded-2xl bg-gray-100 hover:bg-gray-200 py-3 text-gray-700 font-semibold transition-all duration-200 hover:scale-105"
            onClick={onClose}
            type="button"
          >Annuler</button>
          <button
            className="flex-1 rounded-2xl bg-gradient-to-r from-brand to-brand hover:from-brand/90 hover:to-brand/90 py-3 text-white font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            onClick={() => onSearch(value)}
            type="button"
          >Rechercher</button>
        </div>
      </div>
    </div>
  );
};

const TrouveAgent = () => {
  const [activeTab, setActiveTab] = useState('agencies');
  const [agencies, setAgencies] = useState([]);
  const [allAgents, setAllAgents] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredAgencies, setFilteredAgencies] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLocalisationPopupOpen, setIsLocalisationPopupOpen] = useState(false);
  const navigate = useNavigate();
  const AGENCIES_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Fetch agencies
    axios.get(`${API_BASE_URL}/api/agences`).then(async res => {
      const agenciesData = await Promise.all(res.data.map(async agence => {
        let agents = [];
        try {
          const agRes = await axios.get(`${API_BASE_URL}/api/agents/agence/email/${agence.email}`);
          if (Array.isArray(agRes.data)) {
            agents = agRes.data.map(agent => ({
              ...agent,
              name: `${agent.prenom} ${agent.nom}`,
              avatar: getImageUrl(agent.image),
            }));
          }
        } catch (e) {
          // If error, leave agents empty
        }
        return {
          id: agence.id,
          name: agence.nom,
          email: agence.email,
          logo: getImageUrl(agence.image),
          address: agence.adresse,
          city: agence.localisation,
          postalCode: '',
          tel: agence.tel || '',
          localTransactions: agence.localTransactions || 0,
          totalTransactions: agence.totalTransactions || 0,
          averagePrice: agence.averagePrice || '',
          rating: agence.rating || 5,
          agents,
        };
      }));
      setAgencies(agenciesData);
    });
    // Fetch agents
    axios.get(`${API_BASE_URL}/api/agents`).then(res => {
      setAllAgents(res.data.map(agent => ({
        ...agent,
        name: `${agent.prenom} ${agent.nom}`,
        avatar: getImageUrl(agent.image),
        address: agent.agence?.adresse || '',
        city: agent.agence?.localisation || '',
        postalCode: '',
        localTransactions: agent.localTransactions || 0,
        totalTransactions: agent.totalTransactions || 0,
        averagePrice: agent.averagePrice || '',
        agency: agent.agence ? {
          name: agent.agence.nom,
          logo: getImageUrl(agent.agence.image),
          id: agent.agence.id,
        } : null,
      })));
    });
  }, []);

  useEffect(() => {
    setFilteredAgencies(agencies);
    setFilteredAgents(allAgents);
  }, [agencies, allAgents]);

  const handleLocalisationSearch = (locValue) => {
    setSearchValue(locValue);
    setIsLocalisationPopupOpen(false);
    const value = locValue.trim().toLowerCase();
    if (!value) {
      setFilteredAgencies(agencies);
      setFilteredAgents(allAgents);
      return;
    }
    setFilteredAgencies(
      agencies.filter(agency =>
        agency.city && agency.city.toLowerCase().includes(value)
      )
    );
    setFilteredAgents(
      allAgents.filter(agent =>
        agent.city && agent.city.toLowerCase().includes(value)
      )
    );
  };

  const handleViewAgency = (agency) => {
    navigate('/VoirLagence', { state: { agency } });
  };

  const handleOpenContact = (agent) => {
    setSelectedAgent(agent);
    setIsPopupOpen(true);
  };

  const handleCloseContact = () => {
    setSelectedAgent(null);
    setIsPopupOpen(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`text-lg ${i < rating ? 'text-amber-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredAgencies.length / AGENCIES_PER_PAGE);
  const paginatedAgencies = filteredAgencies.slice((currentPage - 1) * AGENCIES_PER_PAGE, currentPage * AGENCIES_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filter changes
  }, [filteredAgencies]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand via-brand to-indigo-700">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Trouvez votre
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Agent Immobilier
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Découvrez les meilleures agences et agents immobiliers près de chez vous
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setIsLocalisationPopupOpen(true)}
              className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl px-6 py-4 text-white placeholder-white/70 hover:bg-white/30 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="text-lg">{searchValue || 'Toulouse, Haute-Garonne'}</span>
                </div>
                <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="flex bg-white rounded-2xl p-2 shadow-lg border border-gray-100 mb-8 max-w-md">
              <button
                className={`flex-1 px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  activeTab === 'agencies' 
                  ? 'bg-gradient-to-r from-brand to-brand text-white shadow-lg' 
                  : 'text-gray-600 hover:text-brand'
                }`}
                onClick={() => setActiveTab('agencies')}
              >
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Agences ({filteredAgencies.length})
                </span>
              </button>
              <button
                className={`flex-1 px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  activeTab === 'agents' 
                  ? 'bg-gradient-to-r from-brand to-brand text-white shadow-lg' 
                  : 'text-gray-600 hover:text-brand'
                }`}
                onClick={() => setActiveTab('agents')}
              >
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Agents ({filteredAgents.length})
                </span>
              </button>
            </div>

            {/* Content Cards */}
            <div className="space-y-6">
              {activeTab === 'agencies' ? (
                paginatedAgencies.map((agency, index) => (
                  <div
                    key={agency.id}
                    className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-4 gap-6 md:gap-8"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Logo */}
                    <div className="flex-shrink-0 flex flex-col items-center w-full md:w-auto">
                      <img
                        src={agency.logo}
                        alt={agency.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-violet-100 shadow"
                      />
                    </div>
                    {/* Main Info */}
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-0">{agency.name}</h3>
                        <div className="flex items-center ml-0 md:ml-2">{renderStars(agency.rating)}</div>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-700">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-violet-500" />
                          <span>{agency.city}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4 text-emerald-500" />
                          <span>{agency.tel || '-'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4 text-indigo-500" />
                          <span className="break-all">{agency.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-violet-500" />
                          <span>{agency.agents.length} agent{agency.agents.length > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                    {/* Button */}
                    <div className="flex flex-col items-center w-full md:w-auto md:ml-auto mt-4 md:mt-0">
                      <button
                        onClick={() => handleViewAgency(agency)}
                        className="bg-gradient-to-r from-brand to-brand text-white px-6 py-3 rounded-xl font-semibold shadow-lg w-full md:w-auto"
                      >
                        Voir l'agence
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                filteredAgents.map((agent, index) => (
                  <div 
                    key={agent.id} 
                    className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="p-8">
                      <div className="flex flex-col lg:flex-row gap-8">
                        {/* Agent Profile */}
                        <div className="flex flex-col items-center">
                          <div className="relative">
                            <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-brand to-brand shadow-lg ring-4 ring-white">
                              <img
                                src={agent.avatar}
                                alt={agent.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                          </div>
                          <button 
                            onClick={() => handleOpenContact(agent)}
                            className="mt-4 bg-gradient-to-r from-brand to-brand text-white px-6 py-3 rounded-2xl font-semibold shadow-lg"
                          >
                            <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Contacter
                          </button>
                        </div>

                        {/* Agent Details */}
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{agent.name}</h3>
                          
                          <div className="flex items-center text-gray-600 mb-4">
                            <svg className="w-5 h-5 mr-2 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {agent.address}, {agent.city}
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gradient-to-r from-blue-200 to-brand rounded-2xl p-4">
                              <div className="text-2xl font-bold text-violet-500">{agent.localTransactions}</div>
                              <div className="text-sm text-gray-600">Transactions locales</div>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4">
                              <div className="text-2xl font-bold text-blue-600">{agent.totalTransactions}</div>
                              <div className="text-sm text-gray-600">Total transactions</div>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-2xl px-4 py-2 inline-block mb-4">
                            <span className="text-sm text-gray-600">Prix médian: </span>
                            <span className="font-semibold text-gray-900">{agent.averagePrice}</span>
                          </div>
                        </div>

                        {/* Agency Info */}
                        {agent.agency && (
                          <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
                              <img
                                src={agent.agency.logo}
                                alt={agent.agency.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="text-center mt-2 mb-4">
                              <div className="text-sm font-semibold text-gray-900">{agent.agency.name}</div>
                            </div>
                            <button 
                              onClick={() => handleViewAgency(agent.agency)}
                              className="bg-gradient-to-r from-indigo-600 to-brand text-white px-6 py-2 rounded-2xl text-sm font-semibold shadow-lg"
                            >
                              Voir l'agence
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination controls for agencies */}
            {activeTab === 'agencies' && totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-semibold border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-violet-700 border-violet-200 hover:bg-violet-50'}`}
                >
                  Précédent
                </button>
                <span className="text-sm text-gray-700">Page {currentPage} / {totalPages}</span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-semibold border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-violet-700 border-violet-200 hover:bg-violet-50'}`}
                >
                  Suivant
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full xl:w-80 space-y-6">
            {/* CTA Card */}
            <div className="bg-gradient-to-br from-brand via-brand to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Choisissez le meilleur</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  L'expérience client et la transparence sont les meilleurs gages de confiance pour votre projet immobilier.
                </p>
              </div>
            </div>

            {/* Agent CTA */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Êtes-vous agent immobilier ?</h4>
                <p className="text-gray-600 text-sm mb-6">
                  Créez votre vitrine maintenant et attirez de nouveaux clients !
                </p>
                <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                  Créer ma vitrine
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <h4 className="text-lg font-bold text-gray-900 mb-6">Statistiques</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Agences disponibles</span>
                  <span className="font-bold text-violet-600">{filteredAgencies.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Agents actifs</span>
                  <span className="font-bold text-blue-600">{filteredAgents.length}</span>
                </div>
                <div className="h-px bg-gray-100"></div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Zone de recherche</span>
                  <span className="font-semibold text-gray-900 text-sm">{searchValue || 'Toulouse'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LocalisationSearchPopup
        open={isLocalisationPopupOpen}
        onClose={() => setIsLocalisationPopupOpen(false)}
        onSearch={handleLocalisationSearch}
        defaultValue={searchValue}
      />
      <ContactAgentPopup open={isPopupOpen} agent={selectedAgent} onClose={handleCloseContact} />

      <style>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default TrouveAgent;