import React from 'react';
import { Edit, Trash2, Mail, Phone, User } from 'lucide-react';
import { Agent } from '../types/Agent';

interface AgentCardProps {
  agent: Agent;
  onEdit: (agent: Agent) => void;
  onDelete: (id: number) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
              {agent.imageUrl ? (
                <img 
                  src={agent.imageUrl} 
                  alt={`${agent.prenom} ${agent.nom}`}
                  className="w-full h-full object-cover"
                />
              ) : agent.image ? (
                <img 
                  src={agent.image} 
                  alt={`${agent.prenom} ${agent.nom}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  {agent.prenom.charAt(0).toUpperCase()}{agent.nom.charAt(0).toUpperCase()}
                </>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {agent.prenom} {agent.nom}
              </h3>
              <p className="text-sm text-gray-600">Agent ID: #{agent.id}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span>{agent.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{agent.tel}</span>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onEdit(agent)}
            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(agent.id)}
            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};