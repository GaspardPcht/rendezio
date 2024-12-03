const uid2 = require('uid2');

const generateToken = () => {
  return uid2(32); 
};

module.exports = generateToken;