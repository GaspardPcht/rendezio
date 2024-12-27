const twilio = require("twilio");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendConfirmationSMS = async (to, message) => {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to, // Numéro du client
    });
    console.log(`SMS envoyé à ${to}`);
  } catch (error) {
    console.error("Erreur lors de l'envoi du SMS :", error);
  }
};

module.exports = { sendConfirmationSMS };