const mongoose = require('mongoose');

const praticienSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Nom complet du praticien
    title: { type: String, required: true }, // Titre professionnel
    email: { type: String, required: true }, // Adresse email de contact
    phoneNumber: { type: String }, // Numéro de téléphone
    services: [
      {
        name: { type: String, required: true }, // Nom du service
        duration: { type: Number, required: true }, // Durée en minutes
        price: { type: Number, required: true }, // Prix en euros
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('praticiens', praticienSchema);