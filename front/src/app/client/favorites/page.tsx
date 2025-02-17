'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

interface Practitioner {
  id: string;
  name: string;
  specialty: string;
  location: string;
  phone: string;
  email: string;
  rating: number;
  image: string;
}

export default function Favorites() {
  const router = useRouter();
  const [practitioners, setPractitioners] = useState<Practitioner[]>([
    {
      id: '1',
      name: 'Dr. Smith',
      specialty: 'Médecin généraliste',
      location: '123 Rue de la Santé, Paris',
      phone: '01 23 45 67 89',
      email: 'dr.smith@example.com',
      rating: 4.8,
      image: '/path/to/image.jpg'
    },
    // Ajoutez d'autres praticiens ici
  ]);

  const handleRemoveFavorite = (id: string) => {
    // Implémentez la logique pour retirer des favoris
    setPractitioners(practitioners.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes praticiens favoris</h1>
        <p className="text-gray-500 mb-8">Gérez vos praticiens favoris et prenez rapidement rendez-vous</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {practitioners.map((practitioner) => (
            <div
              key={practitioner.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                      {/* Add image here */}
                      <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                        <span className="text-2xl text-white font-semibold">
                          {practitioner.name[0]}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {practitioner.name}
                      </h3>
                      <p className="text-gray-500">{practitioner.specialty}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFavorite(practitioner.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaStar className="text-xl" />
                  </button>
                </div>

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{practitioner.location}</span>
                  </div>
                  <div className="flex items-center">
                    <FaPhone className="mr-2" />
                    <span>{practitioner.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <FaEnvelope className="mr-2" />
                    <span>{practitioner.email}</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="font-semibold">{practitioner.rating}</span>
                  </div>
                  <button
                    onClick={() => router.push(`/reservation?practitioner=${practitioner.id}`)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Prendre RDV
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 