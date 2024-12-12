'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TiltCard from '../../components/TiltCards';
export default function Home() {
  const router = useRouter();
  const handleConnection = () => {
    router.push('/auth/signin');
  };
  const handleInscription = () => {
    router.push('/auth/signup');
  };

  return (
    <div className="bg-white min-h-screen">
      <header className="flex items-center justify-between px-8 py-4 border-b">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <img src="/Logo/logo.png" alt="Rendezio Logo" className="h-16 w-16" />
        </div>
        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <Link href="/admin" legacyBehavior>
            <a className="text-gray-700 hover:text-blue-500">Entreprise</a>
          </Link>
          {/* Connexion */}
          <button
            onClick={handleConnection}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Connexion
          </button>
          <button
            onClick={handleInscription}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Inscription
          </button>
        </nav>
      </header>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex items-center justify-center space-x-8 w-full">
          <h1 className="text-6xl text-[#00263B] font-bold">BookSafe BookNow</h1>
          <div className="flex text-black">
            <TiltCard />
          </div>
        </div>
      </div>
    </div>
  );
}
