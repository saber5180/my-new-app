import React, { useState } from 'react';
import { Building2, MapPin, Edit, Save, X, Lock } from 'lucide-react';
import { Agency, AgencyFormData } from '../types/Agency';
import { ImageUpload } from './ImageUpload';

interface AgencySectionProps {
  agency: Agency;
  onUpdate: (data: AgencyFormData) => void;
}

export const AgencySection: React.FC<AgencySectionProps> = ({ agency, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<AgencyFormData>({
    adress: agency.adress,
    motPasse: agency.motPasse,
    nom: agency.nom,
    localisation: agency.localisation,
    image: agency.image
  });
  const [errors, setErrors] = useState<Partial<AgencyFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<AgencyFormData> = {};

    if (!formData.nom.trim()) newErrors.nom = 'Agency name is required';
    if (!formData.adress.trim()) newErrors.adress = 'Address is required';
    if (!formData.localisation.trim()) newErrors.localisation = 'Location is required';
    if (!formData.motPasse.trim()) newErrors.motPasse = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onUpdate(formData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      adress: agency.adress,
      motPasse: agency.motPasse,
      nom: agency.nom,
      localisation: agency.localisation,
      image: agency.image
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof AgencyFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (image: string) => {
    setFormData(prev => ({ ...prev, image }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center overflow-hidden">
              {agency.image ? (
                <img 
                  src={agency.image} 
                  alt={agency.nom}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Agency Information</h1>
              <p className="text-blue-100 mt-1">Manage your agency details</p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/30 transition-all duration-200"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-8">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agency Name *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                    errors.nom ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter agency name"
                />
                {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="localisation"
                  value={formData.localisation}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                    errors.localisation ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter location"
                />
                {errors.localisation && <p className="text-red-500 text-sm mt-1">{errors.localisation}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                name="adress"
                value={formData.adress}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.adress ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full address"
              />
              {errors.adress && <p className="text-red-500 text-sm mt-1">{errors.adress}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="motPasse"
                value={formData.motPasse}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.motPasse ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter password"
              />
              {errors.motPasse && <p className="text-red-500 text-sm mt-1">{errors.motPasse}</p>}
            </div>

            <ImageUpload
              value={formData.image || ''}
              onChange={handleImageChange}
              label="Agency Logo"
            />

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{agency.nom}</h3>
                <div className="flex items-start space-x-2 text-gray-600">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{agency.localisation}</p>
                    <p className="text-sm mt-1">{agency.adress}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-medium">Security</span>
                </div>
                <p className="text-sm text-gray-500">Password is protected and encrypted</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};