import { useEffect, useState } from 'react';
import { Edit2 } from 'lucide-react';
import type { Therapist } from '../TherapistsPage';

export const TherapistsList = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await fetch('/api/therapists');
        const data = await response.json();
        setTherapists(data);
      } catch (error) {
        console.error('Error fetching therapists:', error);
      }
    };

    fetchTherapists();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Ingreso</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {therapists.map((therapist) => (
              <tr key={therapist.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {`${therapist.user.person.name} ${therapist.user.person.lastname}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {therapist.user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {therapist.user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(therapist.onboard_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};