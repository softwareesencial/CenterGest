import type { ClientDetails } from "../../services/ClientService";


interface PersonalTabProps {
  client: ClientDetails;
  onChange: (client: ClientDetails) => void;
}

export const PersonalTab = ({ client, onChange }: PersonalTabProps) => {
  const handleChange = (field: keyof typeof client.person, value: string) => {
    onChange({
      ...client,
      person: { ...client.person, [field]: value }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          value={client.person.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Apellidos</label>
        <input
          type="text"
          value={client.person.lastname}
          onChange={(e) => handleChange('lastname', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
        <input
          type="date"
          value={client.person.birthdate || ''}
          onChange={(e) => handleChange('birthdate', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};