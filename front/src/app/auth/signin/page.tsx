'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '../../../../components/Button';
import ConnexionGoogleClients from '../../../../components/ConnexionGoogleClients';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../../reducers/user';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const checkSignin = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/users/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }

      console.log('Signin successful:', data);

      dispatch(
        setUser({ email: data.user.email, name: data.user.firstName, token: data.user.token })
      );
      router.push('/client/dashboard');
      return data;
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Erreur de connexion. Veuillez vérifier vos identifiants.');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim() === '' || password.trim() === '') {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    console.log('Tentative de connexion avec :', { email, password });
    await checkSignin();

    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <Image src={'/Logo/logo.png'} alt="logo" width={50} height={50} />
        <h2 className="text-2xl font-bold mb-4 text-black text-center">
          Se connecter
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
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
          <ConnexionGoogleClients />
          <div>
            <Button text="Se connecter" />
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Vous n'avez pas de compte ?{' '}
          <a href="/auth/signup" className="text-blue-500 hover:underline">
            Inscrivez-vous
          </a>
        </p>
      </div>
    </div>
  );
}
