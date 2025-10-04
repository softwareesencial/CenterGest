import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface ServiceCardProps {
  service: {
    id: number;
    name: string;
    code: string;
    description: string | null;
    is_active: boolean;
  };
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {service.name}
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              Código: {service.code}
            </p>
          </div>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              service.is_active
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {service.is_active ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        
        {service.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {service.description}
          </p>
        )}

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => onEdit?.(service.id)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
            aria-label="Editar servicio"
          >
            <Edit className="w-5 h-5" />
          </button>
          {/* <button
            onClick={() => onDelete?.(service.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
            aria-label="Eliminar servicio"
          >
            <Trash2 className="w-5 h-5" />
          </button> */}
        </div>
      </div>
    </div>
  );
};