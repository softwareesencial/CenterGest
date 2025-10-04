import { Plus, Trash2 } from "lucide-react";
import { type ClientDetails, type Address } from "../../services/ClientService";

interface AddressTabProps {
  client: ClientDetails;
  onChange: (client: ClientDetails) => void;
}

export const AddressTab = ({ client, onChange }: AddressTabProps) => {
  const handleAddressChange = (index: number, field: keyof Address, value: string) => {
    const newAddresses = [...client.addresses];
    newAddresses[index] = { ...newAddresses[index], [field]: value };
    onChange({ ...client, addresses: newAddresses });
  };

  const addAddress = () => {
    const newAddress: Address = {
      person_id: client.person_id,
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      type: "home"
    };
    onChange({ ...client, addresses: [...client.addresses, newAddress] });
  };

  const removeAddress = (index: number) => {
    const newAddresses = client.addresses.filter((_, i) => i !== index);
    onChange({ ...client, addresses: newAddresses });
  };

  return (
    <div className="space-y-6">
      {client.addresses.map((address, index) => (
        <div key={index} className="p-4 border rounded-md space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Dirección {index + 1}</h3>
            <button
              onClick={() => removeAddress(index)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Calle</label>
              <input
                type="text"
                value={address.street}
                onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ciudad</label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado/Provincia</label>
              <input
                type="text"
                value={address.state}
                onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Código Postal</label>
              <input
                type="text"
                value={address.zip}
                onChange={(e) => handleAddressChange(index, 'zip', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">País</label>
              <input
                type="text"
                value={address.country}
                onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo</label>
              <select
                value={address.type}
                onChange={(e) => handleAddressChange(index, 'type', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="home">Casa</option>
                <option value="work">Trabajo</option>
                <option value="other">Otro</option>
              </select>
            </div>
          </div>
        </div>
      ))}
      
      <button
        onClick={addAddress}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
      >
        <Plus size={20} />
        Agregar Dirección
      </button>
    </div>
  );
};