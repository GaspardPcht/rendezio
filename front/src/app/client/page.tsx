'use client';

import React from 'react';

export default function ClientLogin() {
  const handleLogin = () => {
    alert('Connexion client');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Connexion Client</h1>
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Email :</label>
            <input
              type="email"
              className="w-full p-2 border rounded-md shadow-sm bg-white focus:ring focus:ring-blue-300 focus:outline-none"
              placeholder="Entrez votre email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Mot de passe :</label>
            <input
              type="password"
              className="w-full p-2 border rounded-md shadow-sm bg-white focus:ring focus:ring-blue-300 focus:outline-none"
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-green-600 transition"
          >
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
}