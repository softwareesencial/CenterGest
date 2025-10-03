import { useState } from 'react';
import { X } from 'lucide-react';

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: () => void;
}

interface FormData {
  name: string;
  lastname: string;
}

interface FormErrors {
  name?: string;
  lastname?: string;
}

export const CreateClientModal = ({ isOpen, onClose, onClientCreated }: CreateClientModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    lastname: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validates the form data
   */
  const ValidateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = 'El apellido es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission
   */
  const HandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ValidateForm()) return;

    setIsSubmitting(true);
    try {
      const { ClientService } = await import('../services/ClientService');
      await ClientService.createClient({
        name: formData.name.trim(),
        lastname: formData.lastname.trim(),
      });

      // Reset form and close modal
      setFormData({ name: '', lastname: '' });
      setErrors({});
      onClientCreated();
      onClose();
    } catch (error) {
      console.error('Error creating client:', error);
      alert('Error al crear el cliente. Por favor intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles input changes
   */
  const HandleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * Handles modal close
   */
  const HandleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: '', lastname: '' });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0 fixed inset-0 transition-opacity bg-gray-500/50">

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Crear Nuevo Cliente
              </h3>
              <button
                onClick={HandleClose}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-500 disabled:opacity-50"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={HandleSubmit}>
              <div className="space-y-4">
                {/* Name field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={HandleInputChange}
                    disabled={isSubmitting}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 ${
                      errors.name
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    placeholder="Ingrese el nombre"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Lastname field */}
                <div>
                  <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    value={formData.lastname}
                    onChange={HandleInputChange}
                    disabled={isSubmitting}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 ${
                      errors.lastname
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    placeholder="Ingrese el apellido"
                  />
                  {errors.lastname && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>
                  )}
                </div>

                <p className="text-sm text-gray-500">
                  * Campos requeridos. Los datos adicionales se pueden completar después.
                </p>
              </div>

              {/* Footer buttons */}
              <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creando...' : 'Crear Cliente'}
                </button>
                <button
                  type="button"
                  onClick={HandleClose}
                  disabled={isSubmitting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};