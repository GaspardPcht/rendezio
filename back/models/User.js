const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { 
      type: String, 
      required: function () {
        return !this.googleId; // Non requis si `googleId` est présent
      },
    },
    email: { type: String, required: true, unique: true },
    password: { 
      type: String, 
      required: function () {
        return !this.googleId; // Non requis si `googleId` est présent
      },
    },
    phoneNumber: { type: String },
    token: { type: String },
    practitioner: { type: mongoose.Schema.Types.ObjectId, ref: 'Practitioner' }, 
    googleId: { type: String, unique: true }, // Ajout d'un champ pour identifier les utilisateurs Google
  },
  {
    timestamps: true, // Ajoute les champs createdAt et updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);