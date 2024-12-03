'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, UseSelector } from 'react-redux';
import { RootState } from '../../../store/store';

interface Service {
  name: string;
  duration: number;
  price: number;
}

interface Address {
  street: string;
  city: string;
  postalCode: string;
}

interface WorkingHours {
  [day: string]: string | null;
}

interface Practitioner {
  name: string;
  title: string;
  email: string;
  phoneNumber: string | null;
  services: Service[];
  address: Address;
  description: string | null;
  workingHours: WorkingHours;
}

const PractitionerInfo: React.FC = () => {
  const [practitioner, setPractitioner] = useState<Practitioner | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state : RootState) => state.practitioner.token);


  useEffect(() => {
    const fetchPractitioner = async () => {

      try {
        const response = await fetch('http://localhost:3000/praticien/infos', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur : ${response.statusText}`);
        }

        const data = await response.json();
        setPractitioner(data.practitioner);
      } catch (err) {
        setError((err as Error).message || 'Erreur lors de la récupération des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchPractitioner();
  }, []);

  if (loading) return <p>Chargement des données...</p>;
  if (error) return <p style={{ color: 'red' }}>Erreur : {error}</p>;

  return (
    <div>
      <h1>Informations du Praticien</h1>
      {practitioner ? (
        <div>
          <p><strong>Nom :</strong> {practitioner.name}</p>
          <p><strong>Titre :</strong> {practitioner.title}</p>
          <p><strong>Email :</strong> {practitioner.email}</p>
          <p><strong>Téléphone :</strong> {practitioner.phoneNumber || 'Non spécifié'}</p>
          <p><strong>Adresse :</strong> {`${practitioner.address.street}, ${practitioner.address.city} ${practitioner.address.postalCode}`}</p>
          <p><strong>Description :</strong> {practitioner.description || 'Non spécifiée'}</p>
          <h3>Services :</h3>
          <ul>
            {practitioner.services.map((service, index) => (
              <li key={index}>
                {service.name} - {service.duration} min - {service.price}€
              </li>
            ))}
          </ul>
          <h3>Horaires :</h3>
          <ul>
            {Object.entries(practitioner.workingHours).map(([day, hours]) => (
              <li key={day}>
                <strong>{day} :</strong> {hours || 'Non spécifié'}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Aucune donnée disponible.</p>
      )}
    </div>
  );
};

export default PractitionerInfo;