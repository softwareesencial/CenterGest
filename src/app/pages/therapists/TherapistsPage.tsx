import { useState } from 'react';
import { Plus } from 'lucide-react';
import { TherapistForm } from './components/TherapistForm';
import { TherapistsList } from './components/TherapistsList';

export interface Therapist {
  id: number;
  resume: string | null;
  onboard_date: string;
  created_at: string;
  updated_at: string;
  app_user: {
    id: number;
    email: string;
    username: string;
    status: 'active' | 'inactive' | 'suspended';
    created_at: string;
    updated_at: string;
    person: {
      id: number;
      name: string;
      lastname: string;
      birthdate: string;
      created_at: string;
      updated_at: string;
    };
  };
}

export const TherapistsPage = () => {
  const [open, setOpen] = useState(false);
  const [therapists, setTherapists] = useState<Therapist[]>([]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleTherapistCreated = (newTherapist: Therapist) => {
    setTherapists(prev => [...prev, newTherapist]);
    handleClose();
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            Gestión de Terapistas
          </h1>
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => setOpen(true)}
          >
            <Plus size={20} />
            <span>Nuevo Terapista</span>
          </button>
        </div>
      </div>

      <TherapistsList therapists={therapists} setTherapists={setTherapists} />

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
            <TherapistForm onClose={handleClose} onSuccess={handleTherapistCreated} />
          </div>
        </div>
      )}
    </div>
  );
};
