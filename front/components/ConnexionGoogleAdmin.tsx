'use client';
import Image from 'next/image';

export default function ConnexionGoogleAdmin() {
  const handleGoogleConnect = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID_ADMIN;
    const redirectUri = encodeURIComponent('https://rendezio-backend.vercel.app/praticien/auth/google/callback');
    
    const params = new URLSearchParams({
      client_id: clientId || '',
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/calendar'
      ].join(' '),
      access_type: 'offline',
      prompt: 'consent'
    });

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    console.log('URL de redirection:', googleAuthUrl);
    window.location.href = googleAuthUrl;
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
      Connecter Google Calendar
    </button>
  );
} 