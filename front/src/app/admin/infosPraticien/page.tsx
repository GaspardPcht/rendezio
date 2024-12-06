'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { useRouter } from 'next/navigation';
import { setToken } from '../../../../reducers/praticien';

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

  const token = useSelector((state: RootState) => state.practitioner.token);
  const tokeen = process.env.NEXT_PUBLIC_TOKEN_PRATICIEN;


  // Mapping des jours de la semaine en français
  const daysInFrench: { [key: string]: string } = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',
  };

  const router = useRouter()
const dispatch = useDispatch()
    // Vérifier le token et dispatcher dans le store
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/admin');
      } else {
        dispatch(setToken(token)); // Dispatcher le token dans le reducer
      }
    }, [router, dispatch]);

  useEffect(() => {
    const fetchPractitioner = async () => {
      try {
        const response = await fetch('http://localhost:3000/praticien/infos', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokeen}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur : ${response.statusText}`);
        }

        const data = await response.json();
        setPractitioner(data.practitioner);
      } catch (err) {
        setError(
          (err as Error).message ||
            'Erreur lors de la récupération des données.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPractitioner();
  }, []);

  if (loading)
    return (
      <p className="text-center text-lg text-gray-600">
        Chargement des données...
      </p>
    );
  if (error)
    return <p className="text-center text-lg text-red-600">Erreur : {error}</p>;

  return (
    <div className="bg-[#EAEAEA] min-h-screen flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Informations du Praticien
      </h1>
      {practitioner ? (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl w-full">
          <p className="text-lg font-medium text-gray-800">
            <strong>Nom :</strong> {practitioner.name}
          </p>
          <p className="text-lg font-medium text-gray-800">
            <strong>Titre :</strong> {practitioner.title}
          </p>
          <p className="text-lg font-medium text-gray-800">
            <strong>Email :</strong> {practitioner.email}
          </p>
          <p className="text-lg font-medium text-gray-800">
            <strong>Téléphone :</strong>{' '}
            {practitioner.phoneNumber || 'Non spécifié'}
          </p>
          <p className="text-lg font-medium text-gray-800">
            <strong>Adresse :</strong>{' '}
            {`${practitioner.address.street}, ${practitioner.address.city} ${practitioner.address.postalCode}`}
          </p>
          <p className="text-lg font-medium text-gray-800">
            <strong>Description :</strong>{' '}
            {practitioner.description || 'Non spécifiée'}
          </p>
          <h3 className="text-xl font-semibold text-gray-900 mt-4">
            Services :
          </h3>
          <ul className="list-disc ml-6">
            {practitioner.services.map((service, index) => (
              <li key={index} className="text-lg text-gray-700">
                {service.name} - {service.duration} min - {service.price}€
              </li>
            ))}
          </ul>
          <h3 className="text-xl font-semibold text-gray-900 mt-4">
            Horaires :
          </h3>
          <ul className="list-disc ml-6">
            {Object.entries(practitioner.workingHours).map(([day, hours]) => (
              <li key={day} className="text-lg text-gray-700">
                <strong>{daysInFrench[day] || day} :</strong>{' '}
                {hours || 'Non spécifié'}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-lg text-white">Aucune donnée disponible.</p>
      )}
    </div>
  );
};

export default PractitionerInfo;
