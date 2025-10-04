import React, { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { ServiceCard } from './components/ServiceCard';
import { NewServiceModal } from './components/NewServiceModal';
import { ServicesService, type Service } from './services/ServicesService';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await ServicesService.getAll();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      // TODO: Add error handling UI
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (id: number) => {
    // TODO: Implement edit functionality using ServicesService.update
    console.log('Edit service:', id);
  };

  const handleDelete = async (id: number) => {
    try {
      await ServicesService.delete(id);
      await fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      // TODO: Add error handling UI
    }
  };

  const handleModalSuccess = () => {
    fetchServices(); // Refresh the services list
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Servicios</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Nuevo Servicio
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <NewServiceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};