'use client';
import Image from 'next/image';

export default function ConnexionGoogleClients() {
  const handleGoogleConnect = () => {
    const backendUrl = process.env.NEXT_PUBLIC_URL_BACKEND;
    console.log('Backend URL:', backendUrl);
    
    if (!backendUrl) {
      console.error('NEXT_PUBLIC_URL_BACKEND non défini');
      return;
    }

    const authUrl = `${backendUrl}/users/auth/google`;
    console.log('Redirection vers:', authUrl);
    
    // Redirection directe sans vérification HEAD
    window.location.href = authUrl;
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