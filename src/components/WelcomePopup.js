import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WelcomePopup = ({ isOpen, onClose, userName }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="bg-white rounded-lg p-8 max-w-md w-full mx-4"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Bienvenue {userName}!
          </h2>
          <p className="text-gray-600 mb-6">
            Vous êtes maintenant connecté à votre espace agent immobilier.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Commencer
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomePopup; 