import { type ClientDetails } from "../../services/ClientService";

interface UserTabProps {
  client: ClientDetails;
  onChange: (client: ClientDetails) => void;
}

export const UserTab = ({ client, onChange }: UserTabProps) => {
  const handleChange = (field: string, value: string) => {
    if (!client.user) return;
    
    onChange({
      ...client,
      user: { ...client.user, [field]: value }
    });
  };

  if (!client.user) return null;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={client.user.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Usuario</label>
        <input
          type="text"
          value={client.user.username}
          onChange={(e) => handleChange('username', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Estado</label>
        <select
          value={client.user.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
          <option value="suspended">Suspendido</option>
        </select>
      </div>
    </div>
  );
};