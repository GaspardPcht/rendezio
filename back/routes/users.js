const express = require('express');
const { google } = require('googleapis');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');
const Praticien = require('../models/Praticien');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/users', (req, res) => {
  res.json({
    message: 'Hello World!'
  });
});

router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, timeZone } =
    req.body;

  try {
    // Vérifie si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hache le mot de passe
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Crée un nouvel utilisateur
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      token: generateToken(),
    });

    // Sauvegarde l'utilisateur
    await newUser.save();

    // Convertit les dates au format local
    const responseUser = {
      ...newUser.toObject(),
      createdAt: new Date(newUser.createdAt).toLocaleString('fr-FR', {
        timeZone: 'Europe/Paris', // Force le fuseau horaire
      }),
      updatedAt: new Date(newUser.updatedAt).toLocaleString('fr-FR', {
        timeZone: 'Europe/Paris', // Force le fuseau horaire
      }),
    };

    res.status(201).json({
      message: 'Compte créé avec succès.',
      userId: newUser._id,
      user: responseUser,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

// Route pour se connecter
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    user.token = generateToken();
    await user.save();

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
      message: 'Connexion réussie.',
      userId: user._id,
      user: userWithoutPassword,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

// Route pour associer un utilisateur à un praticien
router.post('/associate-pratitien', async (req, res) => {
  const { userId, practitionerEmail } = req.body;

  try {
    // Vérifie si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    // Vérifie si le praticien existe
    const practitioner = await Praticien.findOne({ email: practitionerEmail });
    if (!practitioner) {
      return res
        .status(404)
        .json({ message: 'Praticien introuvable avec cet email.' });
    }

    // Associe l'utilisateur au praticien
    user.practitioner = practitioner._id;
    await user.save();

    res.status(200).json({
      message: 'Utilisateur associé au praticien avec succès.',
      user: {
        ...user.toObject(),
        practitioner: practitioner.toObject(), // Retourne les infos du praticien associées
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

// const clientOAuth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID_CLIENTS,
//   process.env.GOOGLE_CLIENT_SECRET_CLIENTS,
//   process.env.GOOGLE_REDIRECT_URI_CLIENTS
// );

// router.get('/auth/google', (req, res) => {
//   const url = clientOAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     prompt: 'consent',
//     scope: [
//       'https://www.googleapis.com/auth/calendar',
//       'https://www.googleapis.com/auth/userinfo.profile',
//       'https://www.googleapis.com/auth/userinfo.email',
//     ],
//   });

//   res.redirect(url);
// });


// router.get('/auth/google/callback', async (req, res) => {
//   try {
//     const { code } = req.query;

//     if (!code) {
//       return res.status(400).json({ message: 'Code d’autorisation manquant.' });
//     }

//     const { tokens } = await clientOAuth2Client.getToken(code);
//     clientOAuth2Client.setCredentials(tokens);

//     const oauth2 = google.oauth2({
//       auth: clientOAuth2Client,
//       version: 'v2',
//     });

//     const { data } = await oauth2.userinfo.get();

//     if (!data.email) {
//       return res
//         .status(400)
//         .json({ message: 'Impossible de récupérer les informations utilisateur.' });
//     }

//     let user = await User.findOne({ email: data.email });

//     if (!user) {
//       user = new User({
//         firstName: data.given_name,
//         lastName: data.family_name || '',
//         email: data.email,
//         avatar: data.picture,
//         googleId: data.id,
//         token: tokens.access_token,
//       });
//       await user.save();
//     } else {
//       user.token = tokens.access_token;
//       await user.save();
//     }

//     // Générer un JWT pour l'utilisateur
//     const jwtToken = jwt.sign(
//       {
//         id: user._id,
//         email: user.email,
//         firstName: user.firstName,
//         avatar: user.avatar,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' } 
//     );

//     // Redirection vers le frontend avec le token dans l'URL
//     res.redirect(`${process.env.FRONTEND_URL}/client/dashboard?token=${jwtToken}`);
//   } catch (error) {
//     console.error('Erreur lors de la connexion Google :', error);
//     res.status(500).json({
//       message: 'Erreur lors de la connexion Google.',
//       error: error.message,
//     });
//   }
// });


// Créer un client OAuth2 avec les informations du Google Client
const clientOAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID_CLIENTS, // Utilise la bonne clé client pour les utilisateurs
  process.env.GOOGLE_CLIENT_SECRET_CLIENTS,
  process.env.GOOGLE_REDIRECT_URI_CLIENTS // URI de redirection pour les clients
);

// Route d'authentification avec Google
router.get('/auth/google', (req, res) => {
  const url = clientOAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  });

  // Rediriger vers Google pour obtenir l'autorisation
  res.redirect(url);
});

// Route de callback après l'authentification
router.get('/auth/google/callback', async (req, res) => {
  try {
    // Extraire le code d'authentification depuis l'URL de redirection
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ message: 'Code d’autorisation manquant.' });
    }

    // Échanger le code contre un token d'accès
    const { tokens } = await clientOAuth2Client.getToken(code);
    clientOAuth2Client.setCredentials(tokens);

    // Utiliser l'API Google pour récupérer les informations de l'utilisateur
    const oauth2 = google.oauth2({
      auth: clientOAuth2Client,
      version: 'v2',
    });

    const { data } = await oauth2.userinfo.get();

    if (!data.email) {
      return res
        .status(400)
        .json({ message: 'Impossible de récupérer les informations utilisateur.' });
    }

    // Chercher l'utilisateur dans la base de données
    let user = await User.findOne({ email: data.email });

    if (!user) {
      // Si l'utilisateur n'existe pas, le créer
      user = new User({
        firstName: data.given_name,
        lastName: data.family_name || '',
        email: data.email,
        avatar: data.picture,
        googleId: data.id,
        token: tokens.access_token,
      });
      await user.save();
    } else {
      // Si l'utilisateur existe, mettre à jour son token
      user.token = tokens.access_token;
      await user.save();
    }

    // Générer un JWT pour l'utilisateur
    const jwtToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        avatar: user.avatar,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Durée du token JWT
    );

    // Rediriger vers le frontend avec le token dans l'URL
    res.redirect(`${process.env.FRONTEND_URL}/client/dashboard?token=${jwtToken}`);
  } catch (error) {
    console.error('Erreur lors de la connexion Google :', error);
    res.status(500).json({
      message: 'Erreur lors de la connexion Google.',
      error: error.message,
    });
  }
});


module.exports = router;
