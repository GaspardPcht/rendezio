'use client';
import Image from 'next/image';

export default function ConnexionGoogleClients() {

  const handleGoogleConnect = () => {
    window.location.href = 'http://localhost:3000/users/auth/google';
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