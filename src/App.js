import React,{useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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


function App() {
  const [searchParams, setSearchParams] = useState({
    numero: null,
    nomVoie: null,
    coordinates: null,
  });

  return (
    <Router>
      <div className="flex flex-col" style={{ background: "#F9FAFB" }}>
        <Header />
        <main className="flex-grow mb-10">
          <Routes>
            <Route
              path="/PrixImmobliers"
              element={
                <div className="flex flex-col h-full">
                  <SearchBar onSearch={setSearchParams} />
                  <div className="flex-1 container   pb-4 pt-2 ">
                    <div className="flex h-full shadow-lg border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <PropertyList properties={properties} searchParams={searchParams} />
                    </div>
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
            <Route path="/PrixEstime" element={<PrixEstime />} />
            <Route path="/" element={<Home />} />
            </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
export default App;