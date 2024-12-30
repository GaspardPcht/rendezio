const nodemailer = require("nodemailer");

// Configuration du transporteur
const transporter = nodemailer.createTransport({
  service: "gmail", // Ou un autre service d'email
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Fonction pour envoyer un email avec HTML
const sendConfirmationEmail = async (to, subject, htmlContent) => {
  if (!to || !subject || !htmlContent) {
    console.error("Tous les paramètres (to, subject, htmlContent) sont requis.");
    return;
  }

  const mailOptions = {
    from: `"Votre Entreprise" <${process.env.EMAIL_USER}>`, // Expéditeur avec un nom
    to, // Destinataire
    subject, // Sujet de l'email
    html: htmlContent, // Contenu HTML
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`E-mail envoyé avec succès à ${to}`);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
  }
};

module.exports = { sendConfirmationEmail };