'use client';

import React from "react";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";

export default function Dashboard() {
const router = useRouter()

  const handleClick = () => {
    router.push('./clients');
  };

  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* En-tête */}
      <header className="bg-white shadow-md p-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Rendezio</h1>
        <p className="text-gray-600">Gérez vos rendez-vous et suivez vos statistiques</p>
      </header>

      {/* Contenu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Carte 1 */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800">Rendez-vous à venir</h2>
          <p className="text-gray-600 mt-2">Vous avez 5 rendez-vous prévus cette semaine.</p>
          <div className="mt-4">
            <Button text="Voir mes rendez-vous" onClick={handleClick} />
          </div>
        </div>

        {/* Carte 2 */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800">Statistiques</h2>
          <p className="text-gray-600 mt-2">Taux de réservation : 85%</p>
          <div className="mt-4">
            <Button text="Voir les détails" onClick={() => alert("Voir les détails")} />
          </div>
        </div>

        {/* Carte 3 */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800">Avis des clients</h2>
          <p className="text-gray-600 mt-2">3 nouveaux avis reçus cette semaine.</p>
          <div className="mt-4">
            <Button text="Lire les avis" onClick={() => alert("Lire les avis")} />
          </div>
        </div>
      </div>
    </div>
  );
}