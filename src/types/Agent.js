/**
 * @typedef {Object} Agent
 * @property {number} id - The agent's unique identifier
 * @property {string} nom - The agent's last name
 * @property {string} prenom - The agent's first name
 * @property {string} email - The agent's email
 * @property {string} tel - The agent's phone number
 * @property {number} agencyId - The ID of the agency the agent belongs to
 * @property {string} image - The agent's image URL
 */

/**
 * @typedef {Object} AgentFormData
 * @property {string} nom - The agent's last name
 * @property {string} prenom - The agent's first name
 * @property {string} email - The agent's email
 * @property {string} tel - The agent's phone number
 * @property {string} image - The agent's image URL
 */

export const AgentType = {
  id: Number,
  nom: String,
  prenom: String,
  email: String,
  tel: String,
  agencyId: Number,
  image: String
};

export const AgentFormDataType = {
  nom: String,
  prenom: String,
  email: String,
  tel: String,
  image: String
}; 