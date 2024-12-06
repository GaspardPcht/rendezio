'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function AddBook() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert('Veuillez sélectionner une date et une heure pour le rendez-vous.');
      return;
    }

    if (!name || !surname || !phone || !email) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setLoading(true);

    const response = await fetch('http://localhost:3000/calendar/create-appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        praticienId: '675071ebda842be512fb980d',
        title: `Consultation avec ${name} ${surname}`,
        description: 'Consultation avec le patient ${name} ${surname}',
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        client: {
          name,
          surname,
          phone,
          email,
        },
      }),
    });

    setLoading(false);

    if (response.ok) {
      alert('Rendez-vous créé et ajouté au calendrier Google !');
      setStartDate(null);
      setEndDate(null);
      setName('');
      setSurname('');
      setPhone('');
      setEmail('');
    } else {
      alert('Erreur lors de la création du rendez-vous.');
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Prendre un Rendez-vous</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Nom :</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
              placeholder="Entrez votre nom"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Prénom :</label>
            <input
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              className="w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
              placeholder="Entrez votre prénom"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Numéro de téléphone :</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
              placeholder="Entrez votre numéro de téléphone"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Adresse e-mail :</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
              placeholder="Entrez votre adresse e-mail"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Date et heure de début :</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              placeholderText="Sélectionnez la date et l'heure"
              className="w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Date et heure de fin :</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              placeholderText="Sélectionnez la date et l'heure"
              className="w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Chargement...' : 'Prendre RDV'}
          </button>
        </form>
      </div>
    </div>
  );
}