import { useEffect, useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { ClientService } from './services/ClientService';
import { Pagination } from './components/Pagination';
import { CreateClientModal } from './components/CreateClientModal';
import type { Client } from './types/Client';

const ITEMS_PER_PAGE = 10;

export const ClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  /**
   * Fetches clients from the database
   */
  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, count } = await ClientService.getClients({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: search || undefined,
      });
      setClients(data);
      setTotalItems(count);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [currentPage, search]);

  /**
   * Handles successful client creation
   */
  const HandleClientCreated = () => {
    // Reset to page 1 and refresh the list
    setCurrentPage(1);
    fetchClients();
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Gestión de Clientes</h1>
          <div className="flex gap-3 items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar clientes..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus size={20} />
              Crear Cliente
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : clients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {search ? 'No se encontraron clientes con ese criterio de búsqueda.' : 'No hay clientes registrados.'}
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Apellido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Ingreso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{client.person.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.person.lastname}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.onboard_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-600 hover:text-blue-900">Ver detalles</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      <CreateClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClientCreated={HandleClientCreated}
      />
    </div>
  );
};

export default ClientsPage;