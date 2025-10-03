import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { TherapistService } from '../services/TherapistService';
import type { Therapist } from '../TherapistsPage';

export const TherapistDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Therapist | null>(null);

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        if (!id) return;
        const data = await TherapistService.getTherapistById(id);
        setTherapist(data);
        setFormData(data);
      } catch (error) {
        console.error('Error fetching therapist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapist();
  }, [id]);

  const handleInputChange = (field: string, value: string) => {
    if (!formData) return;

    const [section, key] = field.split('.');
    setFormData(prev => {
      if (!prev) return prev;
      
      if (section === 'person') {
        return {
          ...prev,
          app_user: {
            ...prev.app_user,
            person: {
              ...prev.app_user.person,
              [key]: value
            }
          }
        };
      }
      if (section === 'user') {
        return {
          ...prev,
          app_user: {
            ...prev.app_user,
            [key]: value
          }
        };
      }
      return {
        ...prev,
        [key]: value
      };
    });
  };

  const handleSave = async () => {
    try {
      if (!formData) return;
      await TherapistService.updateTherapist(formData);
      setTherapist(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating therapist:', error);
    }
  };

  const handleCancel = () => {
    setFormData(therapist);
    setIsEditing(false);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!therapist || !formData) {
    return <div className="p-6">Therapist not found</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/therapists')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          <span>Volver a la lista</span>
        </button>
        
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                <Save size={20} />
                <span>Guardar</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                <X size={20} />
                <span>Cancelar</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <span>Editar</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {/* Personal Information Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Nombre</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.app_user.person.name}
                  onChange={(e) => handleInputChange('person.name', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1">{formData.app_user.person.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Apellido</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.app_user.person.lastname}
                  onChange={(e) => handleInputChange('person.lastname', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1">{formData.app_user.person.lastname}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Fecha de Nacimiento</label>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.app_user.person.birthdate?.split('T')[0] || ''}
                  onChange={(e) => handleInputChange('person.birthdate', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1">
                  {formData.app_user.person.birthdate ? 
                    new Date(formData.app_user.person.birthdate).toLocaleDateString() : 
                    'No especificado'
                  }
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Account Information Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Información de Cuenta</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.app_user.email}
                  onChange={(e) => handleInputChange('user.email', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1">{formData.app_user.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Username</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.app_user.username}
                  onChange={(e) => handleInputChange('user.username', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1">{formData.app_user.username}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Estado</label>
              {isEditing ? (
                <select
                  value={formData.app_user.status}
                  onChange={(e) => handleInputChange('user.status', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="suspended">Suspendido</option>
                </select>
              ) : (
                <p className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${formData.app_user.status === 'active' ? 'bg-green-100 text-green-800' : 
                      formData.app_user.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                      'bg-red-100 text-red-800'}`}
                  >
                    {formData.app_user.status}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Professional Information Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Información Profesional</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Fecha de Ingreso</label>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.onboard_date.split('T')[0]}
                  onChange={(e) => handleInputChange('onboard_date', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1">{new Date(formData.onboard_date).toLocaleDateString()}</p>
              )}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-500">Resumen</label>
              {isEditing ? (
                <textarea
                  value={formData.resume || ''}
                  onChange={(e) => handleInputChange('resume', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={4}
                />
              ) : (
                <p className="mt-1">{formData.resume || 'No especificado'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};