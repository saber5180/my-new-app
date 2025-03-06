import React, { useState } from "react";

const RangeSlider = () => {
  const [min, setMin] = useState(10);
  const [max, setMax] = useState(80);
  const [dragging, setDragging] = useState(null);

  const handleMouseDown = (thumb) => {
    setDragging(thumb);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;

    const bar = e.target.closest(".relative");
    if (!bar) return;

    const rect = bar.getBoundingClientRect();
    let newPosition = ((e.clientX - rect.left) / rect.width) * 100;
    newPosition = Math.max(0, Math.min(100, newPosition));

    if (dragging === "min" && newPosition < max) {
      setMin(newPosition);
    } else if (dragging === "max" && newPosition > min) {
      setMax(newPosition);
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  return (
    <div
      className="relative mb-4"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="h-2 bg-gray-200 rounded-full">
        <div
          className="absolute h-2 bg-indigo-500 rounded-full"
          style={{ width: `${max - min}%`, left: `${min}%` }}
        ></div>
        <div
          className="absolute w-4 h-4 bg-white border-2 border-indigo-500 rounded-full -mt-1 cursor-pointer"
          style={{ left: `${min}%` }}
          onMouseDown={() => handleMouseDown("min")}
        ></div>
        <div
          className="absolute w-4 h-4 bg-white border-2 border-indigo-500 rounded-full -mt-1 cursor-pointer"
          style={{ left: `${max}%` }}
          onMouseDown={() => handleMouseDown("max")}
        ></div>
      </div>
    </div>
  );
};

const FilterPopup = ({ isOpen, onClose, onApply }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl p-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Filtres</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Date de vente */}
          <div>
            <h3 className="font-medium mb-2">Date de vente</h3>
            <p className="text-sm text-gray-500 mb-2">Toutes les valeurs</p>
            <RangeSlider />
            <div className="flex gap-2 mt-4">
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                Depuis 2014
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                Depuis 2023
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                1er sem 2024
              </button>
            </div>
          </div>

          {/* Prix de vente */}
          <div>
            <h3 className="font-medium mb-2">Prix de vente</h3>
            <p className="text-sm text-gray-500 mb-2">Toutes les valeurs</p>
            <RangeSlider />
          </div>

          {/* Prix au m² */}
          <div>
            <h3 className="font-medium mb-2">Prix au m²</h3>
            <p className="text-sm text-gray-500 mb-2">Toutes les valeurs</p>
            <RangeSlider />
          </div>

          {/* Type de bien */}
          <div>
            <h3 className="font-medium mb-4">Type de bien</h3>
            <div className="space-y-3">
              {["Maison", "Appartement", "Local Commercial/Industriel", "Terrain", "Biens multiples"].map((type) => (
                <div className="flex items-center" key={type}>
                  <input type="checkbox" className="w-4 h-4 accent-indigo-500" defaultChecked />
                  <label className="ml-2">{type}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Nombre de pièces */}
          <div>
            <h3 className="font-medium mb-4">Nombre de pièces</h3>
            <div className="space-y-3">
              {["2 pièces", "3 pièces", "4 pièces", "5 pièces et +"].map((piece) => (
                <div className="flex items-center" key={piece}>
                  <input type="checkbox" className="w-4 h-4 accent-indigo-500" defaultChecked />
                  <label className="ml-2">{piece}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Surface */}
          <div>
            <h3 className="font-medium mb-2">Surface</h3>
            <p className="text-sm text-gray-500 mb-2">Toutes les valeurs</p>
            <RangeSlider />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={onApply}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPopup;
