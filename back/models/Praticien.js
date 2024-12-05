const mongoose = require('mongoose');

const praticienSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, 
    title: { type: String, required: true }, 
    email: { type: String, required: true }, 
    phoneNumber: { type: String }, 
    services: [
      {
        name: { type: String, required: true }, 
        duration: { type: Number, required: true }, 
        price: { type: Number, required: true }, 
      },
    ],
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    description: { type: String }, // Description ou biographie du praticien
    workingHours: {
      monday: { type: String },
      tuesday: { type: String },
      wednesday: { type: String },
      thursday: { type: String },
      friday: { type: String },
      saturday: { type: String },
      sunday: { type: String },
    },
    token: { type: String, required: true, unique: true }, 
    googleTokens: {
      access_token: { type: String }, // Token d'accès Google
      refresh_token: { type: String }, // Token de rafraîchissement
      scope: { type: String }, // Portée d'accès
      token_type: { type: String }, // Type de token
      expiry_date: { type: Number }, // Date d'expiration
    },
  },
  
  { timestamps: true }
);

module.exports = mongoose.model('praticiens', praticienSchema);