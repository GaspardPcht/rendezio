'use client';
import React from 'react';
import Button from '../../../../components/Button';

export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* En-tête */}
      <header className="bg-white shadow-md p-4 mb-6 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800">
          Tableau de bord Client
        </h1>
        <p className="text-gray-600">
          Gérez vos rendez-vous et vos informations personnelles.
        </p>
      </header>

      {/* Contenu principal */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between lg:space-x-6 space-y-6 lg:space-y-0">
        {/* Colonne gauche */}
        <div className="w-full lg:w-1/4 space-y-6">
          {/* Carte : Rendez-vous */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Mes rendez-vous
            </h2>
            <p className="text-gray-600 mt-2">
              Consultez et modifiez vos rendez-vous en un clic.
            </p>
            <div className="mt-4">
              <Button
                text="Voir mes rendez-vous"
                onClick={() => alert('Rendez-vous')}
              />
            </div>
          </div>

          {/* Carte : Historique */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800">Historique</h2>
            <p className="text-gray-600 mt-2">
              Consultez vos rendez-vous passés.
            </p>
            <div className="mt-4">
              <Button
                text="Voir l'historique"
                onClick={() => alert('Historique')}
              />
            </div>
          </div>
        </div>

        {/* Colonne centrale */}
        <div className="flex-1 bg-white shadow-lg rounded-lg p-6 max-w-[900px]">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Mes Statistiques
          </h2>
          <p className="text-gray-600">
            Consultez vos statistiques de rendez-vous, vos évaluations et bien
            plus encore.
          </p>
          {/* Exemple de statistiques */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-gray-700">
                Rendez-vous futurs
              </h3>
              <p className="mt-2 text-lg font-bold text-gray-800">3</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-gray-700">
                Rendez-vous passés
              </h3>
              <p className="mt-2 text-lg font-bold text-gray-800">12</p>
            </div>
          </div>
        </div>

        {/* Colonne droite */}
        <div className="w-full lg:w-1/4 space-y-6">
          {/* Carte : Informations personnelles */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Mes informations
            </h2>
            <p className="text-gray-600 mt-2">
              Modifiez vos informations personnelles.
            </p>
            <div className="mt-4">
              <Button
                text="Modifier mes informations"
                onClick={() => alert('Informations')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
