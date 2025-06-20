import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import PropertyList from './Page/PropertyList';
import Footer from './components/Footer';
import { properties } from './data/properties';
import LouerPage from './Page/Louer';
import Home from './Page/Home';
import TrouveAgent from './Page/TrouveAgent';
import VoirLagence from './Page/VoirLagence';
import RecherchLouer from './components/ComponedNonLiee/RecherchLouer';
import Main5 from './components/ComponedNonLiee/Main5';
import Estimation from './components/ComponedNonLiee/Estimation';
import EstimationRechercher from './components/ComponedNonLiee/EstimationRechercher';
import PrixEstime from './components/ComponedNonLiee/PrixEstime';
import Login from './Page/Login';
import Agence from './components/ComponedNonLiee/Agence';

const AppContent = ({ searchParams, setSearchParams }) => {
  const location = useLocation();
  const hideFooter = location.pathname === '/PrixImmobliers';

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F9FAFB" }}>
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      
      {/* Main content with top padding to account for fixed header */}
      <main className={`flex-grow pt-20 ${hideFooter ? 'h-screen overflow-hidden' : 'mb-10'}`}>
        <Routes>
           <Route
            path="/PrixImmobliers"
            element={
              <div className="flex flex-col h-full">
                <div className="flex-shrink-0">
                  <SearchBar onSearch={setSearchParams} />
                </div>
                <div className="flex-1 min-h-0 overflow-hidden">
                  <PropertyList properties={properties} searchParams={searchParams} />
                </div>
              </div>
            }
          />
          <Route path="/louer" element={<LouerPage />} />
          <Route path="/TrouverAgent" element={<TrouveAgent />} />
          <Route path="/VoirLagence" element={<VoirLagence />} />
          <Route path="/RecherchLouer" element={<RecherchLouer />} />
          <Route path="/Main5" element={<Main5 />} />
          <Route path="/estimation" element={<Estimation />} />
          <Route path="/EstimationRechercher" element={<EstimationRechercher />} />
          <Route path="/login" element={<Login />} />
          <Route path="/agence" element={<Agence />} />
          <Route path="/PrixEstime" element={<PrixEstime />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      
      {!hideFooter && <Footer />}
    </div>
  );
};

function App() {
  const [searchParams, setSearchParams] = useState({
    numero: null,
    nomVoie: null,
    coordinates: null,
  });

  return (
    <Router>
      <AppContent searchParams={searchParams} setSearchParams={setSearchParams} />
    </Router>
  );
}

export default App;