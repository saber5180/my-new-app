import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AgencySection from './components/AgencySection';
import AgentList from './components/AgentList';
import AgentForm from './components/AgentForm';
import DeleteConfirmation from './components/DeleteConfirmation';
import WelcomePopup from '../../components/WelcomePopup';

// Sample agency data
const initialAgency = {
  id: 1,
  nom: 'Elite Real Estate Agency',
  adress: '123 Business District, Downtown Area, Metropolitan City, 12345',
  localisation: 'Metropolitan City Center',
  image: ''
};

function Agence() {
  const [agency, setAgency] = useState(initialAgency);
  const [agents, setAgents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    agentId: 0,
    agentName: ''
  });
  const [showWelcome, setShowWelcome] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const storedToken = localStorage.getItem('jwt');
        console.log('Stored token:', storedToken);
        console.log('Redux token:', token);

        if (!token && !storedToken) {
          console.log('No token found, redirecting to login');
          navigate('/login');
          return;
        }

        const tokenToUse = token || storedToken;
        let decodedToken = null;
        try {
          const base64Url = tokenToUse.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          decodedToken = JSON.parse(window.atob(base64));
          console.log('Decoded token:', decodedToken);
        } catch (decodeError) {
          console.error('Error decoding token:', decodeError);
        }

        let currentAgencyId = null;
        if (decodedToken && decodedToken.sub) {
          try {
            const agencyResponse = await axios.get(
              `http://localhost:8080/api/agences/email/${decodedToken.sub}`,
              {
                headers: {
                  Authorization: `Bearer ${tokenToUse}`
                }
              }
            );
            setAgency(agencyResponse.data);
            currentAgencyId = agencyResponse.data.id;
            if (agencyResponse.data.email) {
              try {
                const agentsRes = await axios.get(`http://localhost:8080/api/agents/agence/email/${agencyResponse.data.email}`, {
                  headers: {
                    Authorization: `Bearer ${tokenToUse}`
                  }
                });
                setAgents(agentsRes.data);
              } catch (err) {
                setAgents([]);
              }
            }
          } catch (agencyError) {
            console.error('Error fetching agency:', agencyError);
            setError("Erreur lors de la récupération des informations de l'agence");
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        if (error.response?.status === 401) {
          localStorage.removeItem('jwt');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleUpdateAgency = async (formData, imageFile) => {
    try {
      const data = new FormData();
      // Append all form fields to FormData
      Object.keys(formData).forEach(key => {
        // Exclude old image path from being sent if a new file is uploaded
        if (key === 'image' && imageFile) return; 
        if (formData[key] !== null) {
            data.append(key, formData[key]);
        }
      });
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      const response = await axios.put(
        `http://localhost:8080/api/agences/${agency.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setAgency(response.data);
    } catch (error) {
      console.error('Error updating agency:', error);
      setError(error.message);
    }
  };

  const handleAddAgent = async (formData, imageFile) => {
    try {
      const data = new FormData();
      data.append('nom', formData.nom);
      data.append('prenom', formData.prenom);
      data.append('tel', formData.tel);
      data.append('email', formData.email);
      if (imageFile) {
        data.append('image', imageFile);
      }
      
      const tokenToUse = token || localStorage.getItem('jwt');
      const response = await axios.post(
        'http://localhost:8080/api/agents',
        data,
        {
          headers: {
            Authorization: `Bearer ${tokenToUse}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setAgents(prev => [...prev, response.data]);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error adding agent:', error);
      setError(error.message);
    }
  };

  const handleEditAgent = async (formData, imageFile) => {
    if (editingAgent) {
      try {
        const data = new FormData();
        data.append('nom', formData.nom);
        data.append('prenom', formData.prenom);
        data.append('tel', formData.tel);
        data.append('email', formData.email);
        if (imageFile) {
          data.append('image', imageFile);
        }

        const response = await axios.put(
          `http://localhost:8080/api/agents/${editingAgent.id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        setAgents(prev => prev.map(agent => 
          agent.id === editingAgent.id ? response.data : agent
        ));
        setEditingAgent(null);
        setIsFormOpen(false);
      } catch (error) {
        console.error('Error updating agent:', error);
        setError(error.message);
      }
    }
  };

  const handleOpenEditForm = (agent) => {
    setEditingAgent(agent);
    setIsFormOpen(true);
  };

  const handleOpenDeleteConfirmation = (id) => {
    const agent = agents.find(a => a.id === id);
    if (agent) {
      setDeleteConfirmation({
        isOpen: true,
        agentId: id,
        agentName: `${agent.prenom} ${agent.nom}`
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/agents/${deleteConfirmation.agentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setAgents(prev => prev.filter(agent => agent.id !== deleteConfirmation.agentId));
      setDeleteConfirmation({ isOpen: false, agentId: 0, agentName: '' });
    } catch (error) {
      console.error('Error deleting agent:', error);
      setError(error.message);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAgent(null);
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteConfirmation({ isOpen: false, agentId: 0, agentName: '' });
  };

  const handleAddNewAgent = () => {
    setEditingAgent(null);
    setIsFormOpen(true);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          <AgencySection
            agency={agency}
            onUpdate={handleUpdateAgency}
          />

          <AgentList
            agents={agents}
            onEdit={handleOpenEditForm}
            onDelete={handleOpenDeleteConfirmation}
            onAdd={handleAddNewAgent}
          />
        </div>

        <AgentForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={editingAgent ? handleEditAgent : handleAddAgent}
          agent={editingAgent}
          title={editingAgent ? 'Edit Agent' : 'Add New Agent'}
        />

        <DeleteConfirmation
          isOpen={deleteConfirmation.isOpen}
          onClose={handleCloseDeleteConfirmation}
          onConfirm={handleConfirmDelete}
          agentName={deleteConfirmation.agentName}
        />

        <WelcomePopup
          isOpen={showWelcome}
          onClose={() => setShowWelcome(false)}
          userName={user?.name || 'Agent'}
        />
      </div>
    </div>
  );
}

export default Agence; 