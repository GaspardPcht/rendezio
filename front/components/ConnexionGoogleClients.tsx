'use client';
import Image from 'next/image';

export default function ConnexionGoogleClients() {
  const handleGoogleConnect = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID_CLIENTS;
    const backendUrl = process.env.NEXT_PUBLIC_URL_BACKEND;
    
    // URL de redirection vers le backend
    const redirectUri = `${backendUrl}/users/auth/google/callback`;
    
    const scope = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/calendar',
      'openid'
    ].join(' ');

    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const searchParams = new URLSearchParams({
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scope,
      access_type: 'offline',
      prompt: 'consent',
      state: JSON.stringify({ source: 'client' }) // Ajouter un état pour identifier la source
    });

    const fullUrl = `${googleAuthUrl}?${searchParams.toString()}`;
    window.location.href = fullUrl;
  };

  return (
    <button
      type="button"
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