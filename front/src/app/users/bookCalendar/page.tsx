'use client';

import React from 'react';

export default function AddBook() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/calendar/create-appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        practitionerId: '675071ebda842be512fb980d',
        title: 'Consultation',
        description: 'Consultation avec le client',
        startTime: '2024-12-10T10:00:00+01:00',
        endTime: '2024-12-10T11:00:00+01:00',
      }),
    });

    if (response.ok) {
      alert('Rendez-vous créé et ajouté au calendrier Google !');
    } else {
      alert('Erreur lors de la création du rendez-vous.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Prendre RDV</button>
      <button onClick={() => window.location.href = 'http://localhost:3000/calendar/auth/google'}>
  Connectez-vous avec Google
</button>
    </form>
  );
}