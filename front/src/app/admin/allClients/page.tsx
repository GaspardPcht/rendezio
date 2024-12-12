'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { RootState } from '../../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../../../../reducers/praticien';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

const ViewClients: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.practitioner.token);
  const practitionerId = useSelector((state: RootState) => state.practitioner.id);

  useEffect(() => {
    if (!token) {
      // Si le token est absent, rediriger vers la page de connexion
      router.push('/admin');
    } else {
      // S'assurer que le token est bien défini dans le reducer (si nécessaire)
      dispatch(setToken(token));
    }
  }, [token, router, dispatch]);

  const fetchAllUsersForPractitioner = async (): Promise<User[]> => {
    try {
      const response = await fetch(
        `http://localhost:3000/praticien/AllUsers?practitionerId=${practitionerId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Utilisateurs associés :', data.users);
      return data.users;
    } catch (err: any) {
      console.error(
        'Erreur lors de la récupération des utilisateurs :',
        err.message
      );
      throw err;
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await fetchAllUsersForPractitioner();
        setUsers(fetchedUsers);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [practitionerId, token]);

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