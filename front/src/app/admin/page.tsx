'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useDispatch } from 'react-redux';
import { setToken, setId } from '../../../reducers/praticien';

export default function AdminLogin() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:3000/praticien/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la connexion.');
      }

      const { token, id } = data.praticien; // Assurez-vous que l'API renvoie un ID et un token

      dispatch(setToken(token));
      dispatch(setId(id));

      // Redirection vers le tableau de bord
      router.push('/admin/dashboard');
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Connexion Admin</h1>
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Email :</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md shadow-sm text-black bg-white focus:ring focus:ring-blue-300 focus:outline-none"
              placeholder="Entrez votre email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Mot de passe :</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md shadow-sm text-black bg-white focus:ring focus:ring-blue-300 focus:outline-none"
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Connexion...' : 'Connexion'}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600">Pas encore inscrit ?</p>
          <button
            onClick={() => router.push('/admin/signup')}
            className="text-blue-500 font-medium hover:underline mt-2"
          >
            Créez un compte
          </button>
        </div>
      </div>
    </div>
  );
}