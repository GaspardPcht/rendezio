'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
// import Button from '../../components/Button';

const Button = dynamic(() => import('../../components/Button'), { ssr: false });

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleConnection = () => {
    router.push('/auth/signin');
  };

  const handleInscription = () => {
    router.push('/auth/signup');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative bg-white min-h-screen flex flex-col m-0 p-0">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b relative">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <img src="/Logo/logo.png" alt="Rendezio Logo" className="h-16 w-16" />
        </div>

        {/* Navigation */}
        <nav className="hidden sm:flex items-center space-x-6">
          <Link href="/admin" legacyBehavior>
            <a className="text-gray-700 hover:text-blue-500">Entreprise</a>
          </Link>
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

        {/* Menu burger pour mobile */}
        <button
          className="sm:hidden flex items-center text-gray-700"
          onClick={toggleMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t flex flex-col items-center space-y-4 py-4 z-50">
            <Link href="/admin" legacyBehavior>
              <a className="text-gray-700 hover:text-blue-500">Entreprise</a>
            </Link>
            <button
              onClick={handleConnection}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-11/12 text-center"
            >
              Connexion
            </button>
            <button
              onClick={handleInscription}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-11/12 text-center"
            >
              Inscription
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative px-4 lg:px-0">
        {/* Texte et images en grille pour desktop */}
        <div className="grid lg:grid-cols-2 lg:gap-8 items-center w-full max-w-6xl relative">
          {/* Texte */}
          <div className="text-center lg:text-left space-y-6">
            <h1 className="text-5xl md:text-8xl text-[#00263B] font-roboto font-extrabold">
              BookSafe
            </h1>
            <h1 className="text-5xl md:text-8xl text-[#00263B] font-roboto font-extrabold">
              BookNow
            </h1>
            {/* Bouton visible uniquement sur desktop */}
            <div className="hidden lg:flex justify-center ml-32 mt-10">
              <Button text="En savoir plus" />
            </div>
          </div>

          {/* Images en triangle */}
          <div className="hidden lg:block relative w-full h-[400px]">
            {/* Première image (en haut au centre) */}
            <Image
              src="/calendar.png"
              alt="Image de RDV"
              width={150}
              height={150}
              className="absolute top-0 left-1/2 transform -translate-x-1/2"
            />
            {/* Deuxième image (en bas à gauche) */}
            <Image
              src="/rdv.png"
              alt="Image de RDV"
              width={150}
              height={150}
              className="absolute bottom-0 left-1/4 transform -translate-x-1/2"
            />
            {/* Troisième image (en bas à droite) */}
            <Image
              src="/rdv.png"
              alt="Image de RDV"
              width={150}
              height={150}
              className="absolute bottom-0 right-1/4 transform translate-x-1/2"
            />
          </div>
        </div>

        {/* Images pour mobile et tablette */}
        <div className="mt-10 flex justify-center lg:hidden">
          {/* Image pour mobile */}
          <div className="sm:hidden">
            <Image
              src="/calendar.png"
              alt="Image de RDV"
              width={200}
              height={200}
            />
          </div>

          {/* Image pour tablette */}
          <div className="hidden sm:flex lg:hidden">
            <Image
              src="/calendar.png"
              alt="Image de RDV pour tablette"
              width={250}
              height={250}
            />
          </div>
        </div>

        {/* Bouton visible uniquement sur mobile/tablette */}
        <div className="mt-10 lg:hidden flex justify-center">
          <Button text="En savoir plus" />
        </div>
      </div>
    </div>
  );
}
