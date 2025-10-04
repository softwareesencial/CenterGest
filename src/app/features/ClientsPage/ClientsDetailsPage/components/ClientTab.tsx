import { type ClientDetails } from "../../services/ClientService";

interface ClientTabProps {
  client: ClientDetails;
  onChange: (client: ClientDetails) => void;
}

export const ClientTab = ({ client, onChange }: ClientTabProps) => {
  const handleChange = (field: keyof ClientDetails, value: string) => {
    onChange({
      ...client,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Fecha de Alta</label>
        <input
          type="date"
          value={client.onboard_date}
          onChange={(e) => handleChange('onboard_date', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};