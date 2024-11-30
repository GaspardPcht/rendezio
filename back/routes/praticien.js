const express = require('express');
const Practitioner = require('../models/Praticien'); 
const router = express.Router();

// Route pour créer un praticien
router.post('/create', async (req, res) => {
  const {
    name,
    title,
    email,
    phoneNumber,
    services,
    address,
    description,
    workingHours,
  } = req.body;

  try {
    // Vérification si l'email existe déjà
    const existingPractitioner = await Practitioner.findOne({ email });
    if (existingPractitioner) {
      return res.status(400).json({ message: 'Un praticien avec cet email existe déjà.' });
    }

    // Création du praticien
    const newPractitioner = new Practitioner({
      name,
      title,
      email,
      phoneNumber,
      services,
      address,
      description,
      workingHours,
    });

    // Sauvegarde dans la base de données
    await newPractitioner.save();

    res.status(201).json({
      message: 'Praticien créé avec succès.',
      practitioner: newPractitioner,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur serveur lors de la création du praticien.',
      error: error.message,
    });
  }
});

module.exports = router;