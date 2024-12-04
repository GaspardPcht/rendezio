'use client';
import React, { useState, useEffect } from "react";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string; 
}

interface ViewClientsProps {
  practitionerEmail: string; // Email du praticien passé en tant que prop
}

const ViewClients: React.FC<ViewClientsProps> = ({ practitionerEmail }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null); 
  const [loading, setLoading] = useState<boolean>(true); 



  const fetchAllUsersForPractitioner = async (email: string): Promise<User[]> => {
    try {
      const response = await fetch("http://localhost:3000/praticien/AllUsers", {
        method: "GET",
        headers: {
          Authorization: `cl@cl.com`, 
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Utilisateurs associés :", data.users);
      return data.users; // Retourne les utilisateurs pour un traitement ultérieur
    } catch (err: any) {
      console.error("Erreur lors de la récupération des utilisateurs :", err.message);
      throw err; // Relance l'erreur pour la gestion dans l'appelant
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await fetchAllUsersForPractitioner(practitionerEmail);
        setUsers(fetchedUsers); // Stocker les utilisateurs dans l'état
      } catch (err: any) {
        setError(err.message); // Stocker le message d'erreur
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [practitionerEmail]);

  if (loading) {
    return <p className="text-gray-600">Chargement des utilisateurs...</p>;
  }

  if (error) {
    return <p className="text-red-500">Erreur : {error}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Clients associés</h1>
      {users.length === 0 ? (
        <p>Aucun utilisateur trouvé.</p>
      ) : (
        <ul className="list-disc ml-6">
          {users.map((user) => (
            <li key={user._id}>
              {user.firstName} {user.lastName} - {user.email}
              {user.phoneNumber && <span> ({user.phoneNumber})</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewClients;