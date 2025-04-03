// utils/addressParser.js
export const parseAddress = (address) => {
    const parts = address.split(' ');
    
    // Handle different address patterns
    if (address.includes('CHE')) {
      return {
        novoie: parts[0],
        typvoie: 'CHE',
        voie: parts.slice(2, -2).join(' '),
        btq: parts.slice(-2)[0]
      };
    }
    
    // Add more patterns as needed
    return {
      novoie: parts[0],
      typvoie: parts[1],
      voie: parts.slice(2, -2).join(' '),
      btq: parts.slice(-2)[0]
    };
  };