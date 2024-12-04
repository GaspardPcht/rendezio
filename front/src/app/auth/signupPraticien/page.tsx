'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setToken } from '../../../../reducers/praticien';
import Button from '../../components/Button';


export default function CreatePractitionerForm() {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    phoneNumber: '',
    services: [{ name: '', duration: '', price: '' }],
    street: '',
    city: '',
    postalCode: '',
    description: '',
    workingHours: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: '',
    },
  });

  const router = useRouter();
  const dispatch = useDispatch(); //

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  type ServiceKey = 'name' | 'duration' | 'price';

  const handleServiceChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    if (['name', 'duration', 'price'].includes(name)) {
      const updatedServices = [...formData.services];
      updatedServices[index][name as ServiceKey] = value;
      setFormData((prev) => ({ ...prev, services: updatedServices }));
    }
  };

  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, { name: '', duration: '', price: '' }],
    }));
  };

  const removeService = (index: number) => {
    const updatedServices = [...formData.services];
    updatedServices.splice(index, 1);
    setFormData((prev) => ({ ...prev, services: updatedServices }));
  };

  const handleWorkingHoursChange = (day: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(
        'http://localhost:3000/praticien/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            address: {
              street: formData.street,
              city: formData.city,
              postalCode: formData.postalCode,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Une erreur est survenue.');
      }

      const data = await response.json();
    console.log(data.token)
      const  token   = data.token; 

      // Dispatch le token dans le store Redux
      dispatch(setToken(token));

      setMessage('Praticien créé avec succès !');
      setFormData({
        name: '',
        title: '',
        email: '',
        phoneNumber: '',
        services: [{ name: '', duration: '', price: '' }],
        street: '',
        city: '',
        postalCode: '',
        description: '',
        workingHours: {
          monday: '',
          tuesday: '',
          wednesday: '',
          thursday: '',
          friday: '',
          saturday: '',
          sunday: '',
        },
      });
      router.push('/dashboard');
    } catch (error: any) {
      setMessage(`Erreur : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl w-full h-[80vh] overflow-y-auto ">
        <h2 className="text-2xl font-bold mb-4 text-black text-center">
          Créer ma fiche
        </h2>
        <p className='text-red-500 text-lg flex justify-center'>Informations visible par les clients</p>
        {message && (
          <p
            className={`text-center mb-4 ${
              message.includes('succès') ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nom complet
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border text-black  border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-transparent"
              required
            />
          </div>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Titre professionnel
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border text-black  border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-transparent"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 text-black rounded-md focus:ring-blue-500 focus:border-blue-500 bg-transparent"
              required
            />
          </div>
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Numéro de téléphone
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 text-black rounded-md focus:ring-blue-500 focus:border-blue-500 bg-transparent"
              required
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-lg font-medium text-gray-700"
            >
              Adresse
            </label>
            <input
              type="text"
              name="street"
              placeholder="Rue"
              value={formData.street}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 text-black rounded-md focus:ring-blue-500 focus:border-blue-500 bg-transparent"              required
            />
            <input
              type="text"
              name="city"
              placeholder="Ville"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 text-black rounded-md focus:ring-blue-500 focus:border-blue-500 bg-transparent"              required
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Code postal"
              value={formData.postalCode}
              onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 text-black rounded-md focus:ring-blue-500 focus:border-blue-500 bg-transparent"
              required
            />
          </div>

          <label
            htmlFor="workingHours"
            className="block text-lg font-medium text-gray-700"
          >
            Horaires de travail
          </label>
          <div className="w-[40%] flex justify-center items-center">
            <div className="grid grid-cols-2 gap-4 w-full">
              {Object.keys(formData.workingHours).map((day) => {
                // Traduction des jours en français
                const frenchDays = {
                  monday: 'Lundi',
                  tuesday: 'Mardi',
                  wednesday: 'Mercredi',
                  thursday: 'Jeudi',
                  friday: 'Vendredi',
                  saturday: 'Samedi',
                  sunday: 'Dimanche',
                };

                return (
                  <React.Fragment key={day}>
                    {/* Colonne pour le jour */}
                    <label className="capitalize font-medium text-gray-700 flex items-center">
                      {frenchDays[day as keyof typeof frenchDays]}
                    </label>
                    {/* Colonne pour l'horaire */}
                    <input
                      type="text"
                      placeholder="ex : 9:00 - 18:00"
                      value={
                        formData.workingHours[
                          day as keyof typeof formData.workingHours
                        ]
                      }
                      onChange={(e) =>
                        handleWorkingHoursChange(day, e.target.value)
                      }
                      className="border-gray-300 text-black rounded-md focus:ring-blue-500 focus:border-blue-500 bg-transparent mt-1 block w-full p-2 border"
                    />
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-lg font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 text-black rounded-md focus:ring-blue-500 focus:border-blue-500 bg-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="services"
              className="block text-lg font-medium text-gray-700"
            >
              Services
            </label>
            {formData.services.map((service, index) => (
              <div key={index} className="space-y-2 mb-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Nom du service"
                  value={service.name}
                  onChange={(e) => handleServiceChange(index, e)}
                  className="mt-1 block w-full p-2 border border-gray-300 text-black rounded-md focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                  required
                />
                <input
                  type="number"
                  name="duration"
                  placeholder="Durée (en minutes)"
                  value={service.duration}
                  onChange={(e) => handleServiceChange(index, e)}
                  className="mt-1 block w-full p-2 border border-gray-300 text-black rounded-md focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                  required
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Prix (€)"
                  value={service.price}
                  onChange={(e) => handleServiceChange(index, e)}
                  className="mt-1 block w-full p-2 border border-gray-300 text-black rounded-md focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeService(index)}
                  className="text-red-500 underline"
                >
                  Supprimer ce service
                </button>
              </div>
            ))}
         <Button text=' Ajouter un service' />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={loading}
            >
              {loading ? 'Chargement...' : 'Créer ma fiche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
