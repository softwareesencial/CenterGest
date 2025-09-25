import { useState } from 'react';
import { Plus } from 'lucide-react';
import { TherapistForm } from './components/TherapistForm';
import { TherapistsList } from './components/TherapistsList';

export interface Therapist {
  id: number;
  user: {
    person: {
      name: string;
      lastname: string;
      birthdate: string;
    };
    email: string;
    username: string;
  };
  resume: string;
  onboard_date: string;
}

export const TherapistsPage = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
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

      <TherapistsList />

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
            <TherapistForm onClose={handleClose} />
          </div>
        </div>
      )}
    </div>
  );
};
