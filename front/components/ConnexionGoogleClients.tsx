'use client';
import Image from 'next/image';

export default function ConnexionGoogleClients() {
  const backendUrl = process.env.NEXT_PUBLIC_URL_BACKEND;
  
  if (!backendUrl) {
    console.error('NEXT_PUBLIC_URL_BACKEND non défini');
    return null;
  }

  const authUrl = `${backendUrl}/users/auth/google`;

  return (
    <a
      href={authUrl}
      className="inline-flex items-center bg-[#EAEAEA] text-black font-bold py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition"
    >
      <Image
        src="/Logo/logo-google.png"
        alt="Google Logo"
        width={24}
        height={24}
        className="mr-2"
      />
      Connectez-vous avec Google
    </a>
  );
}