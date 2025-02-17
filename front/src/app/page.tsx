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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-extrabold mb-2">
              BookSafe
            </h1>
            <h1 className="text-6xl md:text-8xl font-extrabold mb-6">
              BookNow
            </h1>
          </div>
          <p className="text-xl mb-8">
            Permettez à vos clients de prendre rendez-vous en ligne 24h/24 et 7j/7
          </p>
          <p className="text-lg mb-8 text-blue-100">
            Suivi automatique, rappels par email et SMS, synchronisation avec votre agenda
          </p>
          <button
            onClick={handleInscription}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition transform hover:scale-105 duration-200"
          >
            Commencer gratuitement
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-blue-600">
            Pourquoi choisir Rendezio ?
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Réservation 24/7</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Vos clients réservent leurs rendez-vous à tout moment, même en dehors des heures d'ouverture
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Suivi automatisé</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Rappels automatiques par email et SMS pour réduire les absences et fidéliser vos clients
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Intégration complète</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Synchronisation avec votre agenda et vos outils existants pour une gestion unifiée
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section avec design moderne */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            Prêt à optimiser votre gestion de rendez-vous ?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
            <button
              onClick={handleInscription}
              className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition transform hover:scale-105 duration-200 shadow-lg"
            >
              S'inscrire maintenant
            </button>
            <Link href="/admin" legacyBehavior>
              <a className="bg-transparent text-white px-10 py-4 rounded-full font-bold text-lg border-2 border-white hover:bg-white hover:text-blue-600 transition transform hover:scale-105 duration-200">
                Espace professionnel
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">À propos</h4>
              <p className="text-gray-400">
                Rendezio est votre partenaire de confiance pour la gestion de rendez-vous professionnels.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
              <ul className="space-y-2">
                <li><Link href="/auth/signin">Connexion</Link></li>
                <li><Link href="/auth/signup">Inscription</Link></li>
                <li><Link href="/admin">Espace pro</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@rendezio.com</li>
                <li>01 23 45 67 89</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Suivez-nous</h4>
              <div className="flex space-x-4">
                {/* Facebook */}
                <a 
                  href="https://facebook.com/rendezio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <svg 
                    className="w-6 h-6" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a 
                  href="https://linkedin.com/company/rendezio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <svg 
                    className="w-6 h-6" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447,20.452H16.893V14.883c0-1.328-.027-3.037-1.852-3.037-1.853,0-2.136,1.445-2.136,2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9,1.637-1.85,3.37-1.85c3.601,0,4.267,2.37,4.267,5.455v6.286ZM5.337,7.433c-1.144,0-2.063-.926-2.063-2.065,0-1.138.92-2.063,2.063-2.063,1.14,0,2.064.925,2.064,2.063,0,1.139-.925,2.065-2.064,2.065Zm2.062,13.019H3.274V9H7.4v11.452ZM22.225,0H1.771C.792,0,0,.774,0,1.729v20.542C0,23.227.792,24,1.771,24h20.451C23.2,24,24,23.227,24,22.271V1.729C24,.774,23.2,0,22.222,0h.003Z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Rendezio. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
