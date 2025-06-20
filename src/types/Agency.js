/**
 * @typedef {Object} Agency
 * @property {number} id - The agency's unique identifier
 * @property {string} nom - The agency's name
 * @property {string} adress - The agency's address
 * @property {string} localisation - The agency's location
 * @property {string} image - The agency's image URL
 */

/**
 * @typedef {Object} AgencyFormData
 * @property {string} nom - The agency's name
 * @property {string} adress - The agency's address
 * @property {string} localisation - The agency's location
 * @property {string} image - The agency's image URL
 */

export const AgencyType = {
  id: Number,
  nom: String,
  adress: String,
  localisation: String,
  image: String
};

export const AgencyFormDataType = {
  nom: String,
  adress: String,
  localisation: String,
  image: String
}; 