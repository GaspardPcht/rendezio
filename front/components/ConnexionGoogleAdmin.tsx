'use client';
import Image from 'next/image';

export default function ConnexionGoogleAdmin() {
  const handleGoogleConnect = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/praticien/auth/google/url`);
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error('Erreur lors de la connexion Google:', error);
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
      Connecter Google Calendar
    </button>
  );
} 