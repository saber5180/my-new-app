import React from 'react';
import { X, Mail, Phone, User, MessageSquare } from 'lucide-react';

const ContactAgentPopup = ({ open, agent, onClose }) => {
  if (!open || !agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Professional backdrop */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-gray-900/80 to-slate-900/80 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Main popup container */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 w-full max-w-md transform animate-slideUp overflow-hidden">
        {/* Subtle top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" />
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110"
          aria-label="Fermer"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center">
          {/* Professional avatar section */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 p-1 shadow-lg">
              <img
                src={agent.avatar || 'https://via.placeholder.com/96'}
                alt={agent.name}
                className="w-full h-full rounded-full object-cover shadow-sm hover:scale-105 transition-transform duration-300"
              />
            </div>
            {/* Online status */}
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>

          {/* Name and title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {agent.name}
            </h2>
            <p className="text-sm text-gray-500 font-medium">Agent Immobilier</p>
            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-2 rounded-full" />
          </div>

          {/* Contact information cards */}
          <div className="space-y-3 w-full mb-8">
            {agent.nom && (
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <User size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Nom de famille</p>
                  <p className="text-gray-800 font-semibold">{agent.nom}</p>
                </div>
              </div>
            )}

            {agent.prenom && (
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <User size={16} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Prénom</p>
                  <p className="text-gray-800 font-semibold">{agent.prenom}</p>
                </div>
              </div>
            )}

            {agent.email && (
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Mail size={16} className="text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</p>
                  <p className="text-gray-800 font-medium break-all">{agent.email}</p>
                </div>
              </div>
            )}

            {agent.tel && (
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Phone size={16} className="text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Téléphone</p>
                  <p className="text-gray-800 font-semibold">{agent.tel}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3 w-full">
            <button
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2"
              onClick={onClose}
            >
              <MessageSquare size={18} />
              <span>Contacter</span>
            </button>
            <button
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-800 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] border border-gray-200 hover:border-gray-300"
              onClick={onClose}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </div>
  );
};

export default ContactAgentPopup;