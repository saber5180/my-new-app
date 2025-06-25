import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EstimationRechercher() {
  const [roomCount, setRoomCount] = useState(2);
  const [apartmentSize, setApartmentSize] = useState('');
  const [intention, setIntention] = useState(null);
  const navigate = useNavigate();

  const roomNumbers = [1, 2, 3, 4, 5, '6+'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center py-12">
      <div className="max-w-2xl w-full mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-100">
        <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-4 text-center">
          Estimation de votre appartement
        </h2>
        <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-6 animate-pulse" />
        <p className="text-sm text-gray-600 mb-8 text-center px-2 md:px-20">
          Inclure le salon, la salle à manger, les chambres et les bureaux, mais exclure la cuisine, la salle de bain, le dressing et l'entrée.
        </p>
        <div className="flex gap-3 justify-center mb-8 flex-wrap">
          {roomNumbers.map((number) => (
            <button
              key={number}
              className={`px-7 py-5 rounded-lg font-semibold shadow transition-all duration-200 border-2 focus:outline-none ${roomCount === number ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-500 scale-105' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'}`}
              onClick={() => setRoomCount(number)}
            >
              {number}
            </button>
          ))}
        </div>
        <div className="mb-8 text-center">
          <h3 className="text-lg font-medium mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Quelle est la superficie de votre appartement ?
          </h3>
          <input
            type="number"
            placeholder="m²"
            value={apartmentSize}
            onChange={(e) => setApartmentSize(e.target.value)}
            className="w-1/4 px-4 py-3 bg-white/80 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center shadow"
          />
        </div>
        <div className="mb-8 text-center">
          <h3 className="text-lg font-medium mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            En ce qui concerne cet appartement
          </h3>
          <div className="space-y-3 max-w-md mx-auto">
            {[
              { value: 'visit', label: 'Je prévois de le visiter' },
              { value: 'buy', label: 'Je compte faire une offre' },
              { value: 'no-plan', label: 'Je n\'ai pas de projet d\'acquisition pour l\'instant' },
              { value: 'other-project', label: 'J\'ai un projet d\'achat, mais pas pour cet appartement' }
            ].map((btn) => (
              <button
                key={btn.value}
                className={`w-full py-3 rounded-lg text-sm font-semibold shadow transition-all duration-200 focus:outline-none ${intention === btn.value ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white scale-105' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setIntention(btn.value)}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <button 
            onClick={() => navigate("/PrixEstime")} 
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}

export default EstimationRechercher;