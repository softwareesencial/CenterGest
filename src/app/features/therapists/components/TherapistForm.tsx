import { useState } from 'react';
import { X } from 'lucide-react';
import { TherapistService } from '../services/TherapistService';
import type { Therapist } from '../TherapistsPage';

interface TherapistFormProps {
  onClose: () => void;
  onSuccess: (therapist: Therapist) => void;
}

interface FormData {
  person: {
    name: string;
    lastname: string;
    birthdate: string;
  };
  user: {
    email: string;
    username: string;
    password: string;
  };
  resume?: string;
}

export const TherapistForm = ({ onClose, onSuccess }: TherapistFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    person: {
      name: '',
      lastname: '',
      birthdate: '',
    },
    user: {
      email: '',
      username: '',
      password: '',
    },
    resume: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTherapist = await TherapistService.createTherapist(formData);
      onSuccess(newTherapist);
    } catch (error) {
      console.error('Error creating therapist:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Nuevo Terapeuta</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.person.name}
            onChange={(e) => setFormData({ ...formData, person: { ...formData.person, name: e.target.value } })}
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellido
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.person.lastname}
            onChange={(e) => setFormData({ ...formData, person: { ...formData.person, lastname: e.target.value } })}
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.user.email}
            onChange={(e) => setFormData({ ...formData, user: { ...formData.user, email: e.target.value } })}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Crear Terapeuta
        </button>
      </div>
    </form>
  );
};