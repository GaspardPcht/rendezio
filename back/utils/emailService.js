const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // Ou votre service d'email (Outlook, Yahoo, etc.)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendConfirmationEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`E-mail envoyé à ${to}`);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
  }
};

module.exports = { sendConfirmationEmail };