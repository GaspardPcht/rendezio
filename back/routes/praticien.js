const express = require('express');
const Practitioner = require('../models/Praticien');
const router = express.Router();
const generateToken = require('../utils/generateToken');
const User = require('../models/User')

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
  const token = req.headers.authorization?.split(' ')[1];

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


router.get('/AllUsers', async (req, res) => {
  const practitionerEmail = req.headers.authorization; 

  if (!practitionerEmail) {
    return res.json({ message: 'Email du praticien manquant.' });
  }

  try {
    // Vérifier si le praticien existe
    const practitioner = await Practitioner.findOne({ email: practitionerEmail });
    if (!practitioner) {
      return res.status(404).json({ message: 'Praticien introuvable.' });
    }

    // Trouver les utilisateurs associés à ce praticien
    const users = await User.find({ practitioner: practitioner._id }).select('-password'); // Exclure les mots de passe

    res.status(200).json({
      message: 'Utilisateurs associés récupérés avec succès.',
      practitioner: practitioner.name,
      users,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

module.exports = router;
