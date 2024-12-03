const express = require('express');
const Practitioner = require('../models/Praticien'); 
const router = express.Router();
const generateToken = require('../utils/generateToken');

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
      return res.json({ message: 'Un praticien avec cet email existe déjà.' });
    }

    // Création du praticien
    const token = generateToken(); 
    const newPractitioner = new Practitioner({
      name,
      title,
      email,
      phoneNumber,
      services,
      address,
      description,
      workingHours,
      token, 
    });

    // Sauvegarde dans la base de données
    await newPractitioner.save();

    res.json({
      message: 'Praticien créé avec succès.',
      practitioner: newPractitioner,
      token, // Retourner le token dans la réponse
    });
  } catch (error) {
    res.json({
      message: 'Erreur serveur lors de la création du praticien.',
      error: error.message,
    });
  }
});

// Route pour récupérer les informations d'un praticien via son token
router.get('/infos', async (req, res) => {
  const { token } = req.query; 

  if (!token) {
    return res.json({ message: 'Token manquant.' });
  }

  try {
    // Rechercher le praticien correspondant au token
    const practitioner = await Practitioner.findOne({ token });

    if (!practitioner) {
      return res.json({ message: 'Praticien non trouvé.' });
    }

    res.json({
      message: 'Praticien récupéré avec succès.',
      practitioner,
    });
  } catch (error) {
    res.json({
      message: 'Erreur serveur lors de la récupération du praticien.',
      error: error.message,
    });
  }
});

module.exports = router;