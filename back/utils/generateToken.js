const uid2 = require('uid2');

const generateToken = () => {
  return uid2(32); // Génère un token de 32 caractères
};

module.exports = generateToken;