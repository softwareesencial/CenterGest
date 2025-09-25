import { useEffect, useState } from 'react';
import { Edit2 } from 'lucide-react';
import { TherapistService } from '../services/TherapistService';
import type { Therapist } from '../TherapistsPage';

export const TherapistsList = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await TherapistService.getTherapists();
        setTherapists(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching therapists');
        console.error('Error fetching therapists:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Cargando...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center p-4">{error}</div>;
  }

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
                  {`${therapist.app_user.person.name} ${therapist.app_user.person.lastname}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {therapist.app_user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {therapist.app_user.username}
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