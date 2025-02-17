'use client';
import Image from 'next/image';

export default function ConnexionGoogleClients() {
  const handleGoogleConnect = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_URL_BACKEND;
      
      // Ajout d'un timeout de 5 secondes
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${backendUrl}/users/auth/google/url`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de redirection non reçue');
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      if (error.name === 'AbortError') {
        // Redirection directe en cas de timeout
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID_CLIENTS;
        const redirectUri = 'https://rendezio-backend.vercel.app/users/auth/google/callback';
        
        const scope = [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email'
        ].join(' ');

        const params = new URLSearchParams({
          client_id: clientId || '',
          redirect_uri: redirectUri,
          response_type: 'code',
          scope: scope,
          access_type: 'offline',
          prompt: 'consent'
        });

        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
      }
    }
  };

  return (
    <button
      onClick={handleGoogleConnect}
      className="flex items-center bg-[#EAEAEA] text-black font-bold py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition"
    >
      <Image
        src="/Logo/logo-google.png"
        alt="Google Logo"
        width={24}
        height={24}
        className="mr-2"
      />
      Connectez-vous avec Google
    </button>
  );
}