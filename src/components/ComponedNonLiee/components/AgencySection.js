import React, { useState, useEffect } from 'react';

const AgencySection = ({ agency, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...agency });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const API_BASE_URL = 'http://localhost:8080';

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('blob:')) return path;
    const imagePath = path.startsWith('uploads/') ? path.substring('uploads/'.length) : path;
    return `${API_BASE_URL}/images/${imagePath}`;
  };
  
  // Effect to update form when agency data changes
  useEffect(() => {
      setFormData({ ...agency });
      if (agency && agency.image) {
          setImagePreview(getImageUrl(agency.image));
      } else {
          setImagePreview('');
      }
  }, [agency]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData, imageFile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ ...agency }); // Reset form data
    if (agency && agency.image) { // Reset preview
        setImagePreview(getImageUrl(agency.image));
    } else {
        setImagePreview('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Informations de l'agence</h2>
        <button
          onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {isEditing ? 'Annuler' : 'Modifier'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields for agency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'agence
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse
            </label>
            <input
              type="text"
              name="adresse"
              value={formData.adresse || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="text"
              name="tel"
              value={formData.tel || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Localisation
            </label>
            <input
              type="text"
              name="localisation"
              value={formData.localisation || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo de l'agence
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Aperçu du logo"
                className="mt-2 w-24 h-24 object-cover rounded-lg border"
              />
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
          >
            Enregistrer
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {/* Display agency info */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Nom de l'agence</h3>
            <p className="text-lg text-gray-900">{agency.nom}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
            <p className="text-lg text-gray-900">{agency.adresse}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
            <p className="text-lg text-gray-900">{agency.tel}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Localisation</h3>
            <p className="text-lg text-gray-900">{agency.localisation}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="text-lg text-gray-900">{agency.email}</p>
          </div>
          {imagePreview && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Logo</h3>
              <img
                src={imagePreview}
                alt="Logo de l'agence"
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgencySection; 