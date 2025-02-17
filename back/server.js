const app = require('./app');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log('URLs configurées:');
  console.log('- Frontend:', process.env.FRONTEND_URL);
  console.log('- Callback:', 'https://rendezio-backend.vercel.app/users/auth/google/callback');
}); 