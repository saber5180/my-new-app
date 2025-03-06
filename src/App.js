import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import PropertyList from './Page/PropertyList';
import Footer from './components/Footer';
import { properties } from './data/properties';
import LouerPage from './Page/Louer';
import TrouveAgent from './Page/TrouveAgent';
import VoirLagence from './Page/VoirLagence';
import Main1 from './components/ComponedNonLiee/Main1';
import Main5 from './components/ComponedNonLiee/Main5';
import Main7 from './components/ComponedNonLiee/Main7';
import Main8 from './components/ComponedNonLiee/Main8';
import Main9 from './components/ComponedNonLiee/Main9';

function App() {
  return (
    <Router>
      <div className="flex flex-col  " style={{background:"#F9FAFB"}}>
        <Header />
        
        <main className="flex-grow mb-10">
          <Routes>
            <Route 
              path="/PrixImmobliers" 
              element={
                <div className="flex flex-col h-full">
                  <SearchBar />
                  <div className="flex-1 container px-4 lg:px-20 pb-4 pt-2 mx-auto">
                    <div className="flex h-full shadow-lg border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <PropertyList properties={properties} />
                    </div>
                  </div>
                </div>
              } 
            />
            <Route path="/louer" element={<LouerPage />} />
            <Route path="/TrouverAgent" element={<TrouveAgent />} />
            <Route path="/VoirLagence" element={<VoirLagence />} />
            <Route path="/Main1" element={<Main1 />} />
            <Route path="/Main5" element={<Main5 />} />
            <Route path="/Main7" element={<Main7 />} />
            <Route path="/Main8" element={<Main8 />} />
            <Route path="/Main9" element={<Main9 />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;