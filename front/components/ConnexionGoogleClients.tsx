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
    console.log('Tentative de redirection vers:', authUrl);
    
    // Vérifier si le backend est accessible
    fetch(authUrl, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          window.location.href = authUrl;
        } else {
          console.error('Le backend n\'est pas accessible:', response.status);
        }
      })
      .catch(error => {
        console.error('Erreur lors de la vérification du backend:', error);
      });
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