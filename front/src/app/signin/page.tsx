'use client'
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); 

  const checkSignin = async () => {
    try {
      const response = await fetch('http://localhost:3000/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to sign in');
      }

      const data = await response.json();
      console.log('Signin successful:', data);

      // Redirige vers la page d'accueil ou une autre page
      router.push('/dashboard');
      return data; 
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur de connexion. Veuillez vérifier vos identifiants.');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    console.log("Tentative de connexion avec :", { email, password });
    await checkSignin(); 

    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <Image src={"/Logo/logo.png"} alt="logo" width={50} height={50} />
        <h2 className="text-2xl font-bold mb-4 text-black text-center">Se connecter</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Adresse e-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-transparent"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Se connecter
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Vous n'avez pas de compte ?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Inscrivez-vous
          </a>
        </p>
      </div>
    </div>
  );
}